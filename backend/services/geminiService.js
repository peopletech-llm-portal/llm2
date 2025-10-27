// backend/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// 1. Extract MCQs from PDF (maps to your Exam schema: correctAnswer as index, e.g., "B" → 1)
async function extractMCQs(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');
  const mimeType = 'application/pdf';

  const prompt = `Extract MCQs as JSON array: [{"question": "Text", "options": ["A. opt1", "B. opt2", "C. opt3", "D. opt4"], "correctAnswer": 1}] where correctAnswer is option index (A=0, B=1). Ignore non-MCQs.`;

  const result = await model.generateContent([
    { text: prompt },
    { inlineData: { data: base64, mimeType } }
  ]);
  return JSON.parse(result.response.text().trim());
}

// 2. Evaluate theoretical answer (examType: "theory")
async function evaluateTheoretical(question, modelAnswer, studentAnswer) {
  const prompt = `Evaluate for question: "${question}". Model: "${modelAnswer}". Student: "${studentAnswer}". Score 0-10 (accuracy:4, completeness:3, clarity:3). JSON: {"score": 8, "feedback": "Good, but expand."}`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text().trim());
}

export { extractMCQs, evaluateTheoretical };