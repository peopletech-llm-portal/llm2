import React, { useState, useEffect } from 'react';

// ✅ Use API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [examType, setExamType] = useState("mcq");
  const [title, setTitle] = useState("");
  const [questionsDraft, setQuestionsDraft] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [codingProblem, setCodingProblem] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", expected: "" }]);
  const [allowedLanguages, setAllowedLanguages] = useState({
    javascript: true,
    python: true,
    c: false,
    cpp: false,
    java: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [editExamId, setEditExamId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [theoryPrompt, setTheoryPrompt] = useState("");

  // Reset form
  const resetForm = () => {
    setExamType("mcq");
    setTitle("");
    setQuestionsDraft([]);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setCodingProblem("");
    setStarterCode("");
    setTestCases([{ input: "", expected: "" }]);
    setAllowedLanguages({
      javascript: true,
      python: true,
      c: false,
      cpp: false,
      java: false,
    });
    setStartTime("");
    setEndTime("");
    setDuration(60);
    setEditExamId(null);
  };

  // Fetch exams
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setExams(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch exams ❌");
      setExams([]);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Create exam
  const handleCreateExam = async () => {
    setError("");
    setSuccess("");
    if (!title.trim()) return setError("Exam title is required");
    if (questionsDraft.length === 0) return setError("At least one question is required");

    try {
      const token = localStorage.getItem("token");
      const examData = {
        title,
        examType,
        questions: questionsDraft,
        startTime: startTime || null,
        endTime: endTime || null,
        duration: duration ? parseInt(duration) : null,
      };
      const res = await fetch(`${API_BASE_URL}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(examData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Exam created successfully ✅");
        resetForm();
        setShowCreateForm(false);
        fetchExams();
      } else setError(data.message || "Failed to create exam");
    } catch (err) {
      setError("Failed to create exam ❌");
    }
  };

  // Update exam
  const handleUpdateExam = async () => {
    setError("");
    setSuccess("");
    if (!title.trim()) return setError("Exam title is required");
    if (questionsDraft.length === 0) return setError("At least one question is required");

    try {
      const token = localStorage.getItem("token");
      const examData = {
        title,
        examType,
        questions: questionsDraft,
        startTime: startTime || null,
        endTime: endTime || null,
        duration: duration ? parseInt(duration) : null,
      };
      const res = await fetch(`${API_BASE_URL}/exams/${editExamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(examData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Exam updated successfully ✅");
        resetForm();
        setShowCreateForm(false);
        fetchExams();
      } else setError(data.message || "Failed to update exam");
    } catch (err) {
      setError("Failed to update exam ❌");
    }
  };

  // Delete exam
  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/exams/${examId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSuccess("Exam deleted successfully ✅");
        fetchExams();
      } else setError("Failed to delete exam");
    } catch {
      setError("Failed to delete exam ❌");
    }
  };

  // The rest of your component (UI and logic) stays **exactly the same** below 👇
  // ✅ No changes needed to JSX or exam builders
  // (Truncated here for brevity — you can keep all your UI code identical)
  
  return (
    // ... entire JSX content as before
    <div> {/* Keep all your JSX below unchanged */} </div>
  );
}

export default ExamManagement;
