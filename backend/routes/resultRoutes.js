import express from "express";
import Result from "../models/Result.js";
import Exam from "../models/Exam.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/results/submit
 * @desc Submit exam answers and calculate score
 */
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user?.id || req.user?._id; // ✅ from token, not frontend
    if (!examId || !studentId || !answers) {
      return res
        .status(400)
        .json({ message: "examId, studentId and answers are required" });
    }

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Check if student has already submitted this exam
    const existingResult = await Result.findOne({ examId, studentId });
    if (existingResult) {
      return res.status(400).json({ 
        message: "You have already submitted this exam. Only one submission per exam is allowed." 
      });
    }

    // MCQ vs Theory handling
    let score = 0;
    let total = exam.questions.length;

    if (exam.examType === "theory") {
      // For theory, store answers and score 0 now (manual evaluation later)
      let theoryAnswers = [];
      if (Array.isArray(answers)) theoryAnswers = answers.map((a) => String(a ?? ""));
      else if (typeof answers === "object" && answers) {
        theoryAnswers = Object.keys(answers)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => String(answers[k] ?? ""));
      }
      const result = await Result.create({
        examId,
        studentId,
        examType: "theory",
        score: 0,
        totalQuestions: total,
        theoryAnswers,
        completed: true, // ✅ mark completed
      });
      
      // Hide scores for Outer users
      if (req.user.role === 'OUTER') {
        return res.json({ message: "✅ Theory exam submitted", score: null, total: null, resultId: result._id });
      }
      
      return res.json({ message: "✅ Theory exam submitted", score: 0, total, resultId: result._id });
    } else if (exam.examType === "coding") {
      // Evaluate in external sandbox (Piston API). Expect: { code, language }
      const code = typeof answers === "object" && answers && answers.code ? String(answers.code) : "";
      const language = typeof answers === "object" && answers && answers.language ? String(answers.language) : "javascript";
      if (!code && !req.body.auto) return res.status(400).json({ message: "Code is required" });

      // Use global fetch if available (Node >=18), else fall back to node-fetch (optional dep)
      const fetch = globalThis.fetch ? globalThis.fetch : (await import("node-fetch")).default;
      const pistonLangMap = {
        javascript: { language: "javascript", version: "18.15.0", file: "main.js", template: (c, input) => `${c}\nconsole.log(String(solve(${JSON.stringify(input)})))` },
        python: { language: "python", version: "3.10.0", file: "main.py", template: (c, input) => `${c}\nprint(str(solve(${JSON.stringify(input)})))` },
        c: { language: "c", version: "10.2.0", file: "main.c", template: (c, input) => `#include <stdio.h>\n${c}\nint main(){ printf("%s", solve(${JSON.stringify(input)})); return 0; }` },
        cpp: { language: "cpp", version: "10.2.0", file: "main.cpp", template: (c, input) => `#include <bits/stdc++.h>\nusing namespace std;\n${c}\nint main(){ cout<<solve(${JSON.stringify(input)}); return 0; }` },
        java: { language: "java", version: "15.0.2", file: "Main.java", template: (c, input) => `${c}\nclass Runner{ public static void main(String[] args){ System.out.print(Main.solve(${JSON.stringify(input)})); } }` },
      };

      const map = pistonLangMap[language] || pistonLangMap.javascript;
      let passed = 0;
      const cases = (exam.questions?.[0]?.testcases || []).slice(0, 20);
      for (const tc of cases) {
        try {
          const body = {
            language: map.language,
            version: map.version,
            files: [
              { name: map.file, content: map.template(code, tc.input) }
            ]
          };
          const resp = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const out = await resp.json();
          const stdout = String(out?.run?.stdout || "").trim();
          if (stdout === String(tc.expected)) passed++;
        } catch (_e) {}
      }

      const result = await Result.create({
        examId,
        studentId,
        examType: "coding",
        score: passed,
        totalQuestions: cases.length || 0,
        coding: { code, language, passed, total: cases.length || 0 },
        completed: true, // ✅ mark completed
      });
      
      // Hide scores for Outer users
      if (req.user.role === 'OUTER') {
        return res.json({ message: "✅ Code evaluated", score: null, total: null, resultId: result._id });
      }
      
      return res.json({ message: "✅ Code evaluated", score: passed, total: cases.length || 0, resultId: result._id });
    } else {
      // Normalize answers to array of indices
      let normalized = answers;
      if (!Array.isArray(answers) && typeof answers === "object") {
        normalized = Object.keys(answers)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => answers[k]);
      }

      if (!Array.isArray(normalized)) {
        return res.status(400).json({ message: "Invalid answers format" });
      }

      exam.questions.forEach((q, idx) => {
        const correctIndex = Number(q.correctAnswer);
        const selected = normalized[idx];
        if (selected === correctIndex) score++;
      });

      const result = await Result.create({
        examId,
        studentId,
        examType: "mcq",
        score,
        totalQuestions: total,
        mcqAnswers: Array.isArray(normalized) ? normalized.map((n) => Number(n)) : [],
        completed: true, // ✅ mark completed
      });
      
      // Hide scores for Outer users
      if (req.user.role === 'OUTER') {
        return res.json({ message: "✅ Exam submitted successfully", score: null, total: null, resultId: result._id });
      }
      
      return res.json({ message: "✅ Exam submitted successfully", score, total, resultId: result._id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

/**
 * @route GET /api/results/:studentId
 * @desc Fetch all results of a student
 */
// Keep legacy route for compatibility - All authenticated users can view their own results
router.get("/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching results for studentId:", req.params.studentId);
    const results = await Result.find({ studentId: req.params.studentId })
      .populate("examId", "title examType")
      .sort({ createdAt: -1 });

    console.log("Found results:", results);
    
    // Filter out results where the exam has been deleted (examId is null after populate)
    const validResults = results.filter(result => result.examId !== null);
    
    // Hide scores for Outer users
    if (req.user.role === 'OUTER') {
      const hiddenResults = validResults.map(result => ({
        ...result.toObject(),
        score: null, // Hide the score
        totalQuestions: null // Hide total questions
      }));
      return res.json(hiddenResults);
    }
    
    res.json(validResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

/**
 * @route GET /api/results/student/:studentId
 * @desc Fetch all results of a student (explicit path)
 */
router.get("/student/:studentId", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId })
      .populate("examId", "title examType")
      .sort({ createdAt: -1 });
    
    // Filter out results where the exam has been deleted (examId is null after populate)
    const validResults = results.filter(result => result.examId !== null);
    
    // Hide scores for Outer users
    if (req.user.role === 'OUTER') {
      const hiddenResults = validResults.map(result => ({
        ...result.toObject(),
        score: null, // Hide the score
        totalQuestions: null // Hide total questions
      }));
      return res.json(hiddenResults);
    }
    
    res.json(validResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

/**
 * @route GET /api/results/detail/:id
 * @desc Fetch a single result with details for admin view
 */
router.get("/detail/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("examId", "title examType questions");
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

/**
 * @route GET /api/results
 * @desc Fetch all results for admin view
 */
router.get("/", authMiddleware, requireRole(['MAIN_ADMIN', 'SUB_ADMIN']), async (req, res) => {
  try {
    const results = await Result.find()
      .populate("examId", "title examType")
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});
// ✅ Fetch all completed exam IDs for a student
router.get("/completed/:studentId", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId, completed: true }).select("examId");
    const completedExamIds = results.map((r) => r.examId);
    res.json({ completedExamIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌", error });
  }
});

export default router;
