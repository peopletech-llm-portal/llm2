// backend/models/Submission.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Subdocument ID from exam.questions
  studentAnswer: { type: String, required: true },
  score: { type: Number }, // 0-10 from Gemini
  feedback: { type: String }, // Gemini feedback
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);