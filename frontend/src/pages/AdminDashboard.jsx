import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL; // ✅ Render-ready base URL

function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [examType, setExamType] = useState("mcq");
  const [title, setTitle] = useState("");
  const [questionsDraft, setQuestionsDraft] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [editExamId, setEditExamId] = useState(null);
  const [theoryEditExam, setTheoryEditExam] = useState(null);
  const [targetRole, setTargetRole] = useState("INTERN");

  // Fetch exams
  const fetchExams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/exams`);
      const data = await res.json();
      setExams(data);
    } catch (err) {
      setError("Failed to fetch exams ❌");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAddQuestion = () => {
    setError("");
    setSuccess("");
    if (!question.trim()) return setError("Question text is required");

    const filledOptions = options.map((o) => o.trim());
    if (filledOptions.some((o) => !o)) return setError("All options are required");

    setQuestionsDraft((prev) => [...prev, { question, options: filledOptions, correctAnswer }]);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setSuccess("Question added");
  };

  const handlePublishExam = async () => {
    setError("");
    setSuccess("");
    if (!title.trim()) return setError("Exam title is required");
    if (questionsDraft.length === 0) return setError("Add at least one question before publishing");

    let payload = { title, questions: questionsDraft, targetRole };
    if (startTime) payload.startTime = new Date(startTime).toISOString();
    if (endTime) payload.endTime = new Date(endTime).toISOString();
    if (duration) payload.duration = Number(duration);

    try {
      const url = editExamId
        ? `${API_BASE}/api/exams/${editExamId}`
        : `${API_BASE}/api/exams`;
      const method = editExamId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, examType: "mcq" }),
      });

      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to create exam ❌");
      else {
        setSuccess(editExamId ? "✅ Exam updated successfully" : "✅ Exam published successfully");
        setTitle("");
        setQuestionsDraft([]);
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer(0);
        setStartTime("");
        setEndTime("");
        setDuration("");
        setEditExamId(null);
        fetchExams();
      }
    } catch (err) {
      setError("Server error while creating exam ❌");
    }
  };

  return (
    <div className="relative p-6 overflow-hidden bg-white min-h-[calc(100vh-0px)]">
      <div className="absolute inset-0 z-0">
        <img src="/peopletech/ptg background.png" alt="Background" className="w-full h-full object-cover opacity-20" />
      </div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-4">📘 Exam Dashboard (Admin)</h2>
        {error && <p className="text-red-600">{error}</p>}

        {/* Buttons for Exam Type */}
        <div className="mb-6 flex gap-3">
          {["mcq", "coding", "theory"].map((type, i) => (
            <button
              key={type}
              onClick={() => setExamType(type)}
              className={`px-4 py-2 rounded border border-zinc-300 ${
                examType === type ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"
              }`}
            >
              {i + 1}) {type.toUpperCase()}
            </button>
          ))}
        </div>

        {examType === "mcq" && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur border rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold mb-3">{editExamId ? "Edit MCQ Exam" : "Create MCQ Exam"}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. JavaScript Basics Quiz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="border p-2 w-full rounded"
                >
                  <option value="INTERN">Intern</option>
                  <option value="OUTER">Outer</option>
                </select>
              </div>

              {/* Question builder */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <input
                    type="text"
                    placeholder="Type the question here"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {options.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[i] = e.target.value;
                          setOptions(newOptions);
                        }}
                        className="border p-2 rounded"
                      />
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">Correct Option</label>
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                      className="border p-2 rounded"
                    >
                      {options.map((_, i) => (
                        <option key={i} value={i}>
                          Option {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleAddQuestion}
                      className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded"
                      type="button"
                    >
                      + Add Question
                    </button>
                    <button
                      onClick={() => {
                        setQuestion("");
                        setOptions(["", "", "", ""]);
                        setCorrectAnswer(0);
                      }}
                      className="px-4 py-2 rounded border border-zinc-300 hover:bg-zinc-100"
                      type="button"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Draft Questions Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Draft Questions ({questionsDraft.length})</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePublishExam}
                        className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded"
                        type="button"
                      >
                        {editExamId ? "Save Changes" : "Publish Exam"}
                      </button>
                    </div>
                  </div>

                  {(error || success) && (
                    <p className={`mt-3 text-sm ${error ? "text-red-600" : "text-zinc-700"}`}>
                      {error || success}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
