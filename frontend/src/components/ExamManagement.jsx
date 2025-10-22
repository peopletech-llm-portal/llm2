import React, { useState, useEffect } from 'react';

export function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [examType, setExamType] = useState("mcq");
  const [title, setTitle] = useState("");
  const [questionsDraft, setQuestionsDraft] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  // Coding exam specific states
  const [codingProblem, setCodingProblem] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", expected: "" }]);
  const [allowedLanguages, setAllowedLanguages] = useState({
    javascript: true,
    python: true,
    c: false,
    cpp: false,
    java: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [editExamId, setEditExamId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Reset form
  const resetForm = () => {
    setExamType('mcq');
    setTitle('');
    setQuestionsDraft([]);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setCodingProblem('');
    setStarterCode('');
    setTestCases([{ input: '', expected: '' }]);
    setAllowedLanguages({
      javascript: true,
      python: true,
      c: false,
      cpp: false,
      java: false
    });
    setStartTime('');
    setEndTime('');
    setDuration(60);
    setEditExamId(null);
  };

  // Handle exam type change
  const handleExamTypeChange = (e) => {
    setExamType(e.target.value);
    setQuestionsDraft([]);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setCodingProblem('');
    setStarterCode('');
    setTestCases([{ input: '', expected: '' }]);
    setAllowedLanguages({
      javascript: true,
      python: true,
      c: false,
      cpp: false,
      java: false
    });
    setError('');
    setSuccess('');
  };

  // Fetch exams
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5000/api/exams", {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
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

  useEffect(() => { fetchExams(); }, []);

  // Add MCQ question to draft
  const handleAddQuestion = () => {
    setError(""); setSuccess("");
    if (!question.trim()) { setError("Question text is required"); return; }
    const filledOptions = options.map(o => o.trim());
    if (filledOptions.some(o => !o)) { setError("All options are required"); return; }
    const newItem = { question, options: filledOptions, correctAnswer };
    setQuestionsDraft(prev => [...prev, newItem]);
    setQuestion(''); setOptions(['', '', '', '']); setCorrectAnswer(0);
    setSuccess("Question added to draft ✅");
  };

  // Remove question from draft
  const handleRemoveQuestion = (index) => {
    setQuestionsDraft(prev => prev.filter((_, i) => i !== index));
  };

  // Create exam
  const handleCreateExam = async () => {
    setError(""); setSuccess("");
    if (!title.trim()) { setError("Exam title is required"); return; }
    if (questionsDraft.length === 0) { setError("At least one question is required"); return; }
    try {
      const token = localStorage.getItem('token');
      const examData = {
        title, examType, questions: questionsDraft,
        startTime: startTime || null,
        endTime: endTime || null,
        duration: duration ? parseInt(duration) : null
      };
      const res = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(examData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Exam created successfully ✅");
        resetForm(); setShowCreateForm(false); fetchExams();
      } else setError(data.message || "Failed to create exam");
    } catch (err) {
      setError("Failed to create exam ❌");
    }
  };

  // Update exam
  const handleUpdateExam = async () => {
    setError(""); setSuccess("");
    if (!title.trim()) { setError("Exam title is required"); return; }
    if (questionsDraft.length === 0) { setError("At least one question is required"); return; }
    try {
      const token = localStorage.getItem('token');
      const examData = {
        title, examType, questions: questionsDraft,
        startTime: startTime || null,
        endTime: endTime || null,
        duration: duration ? parseInt(duration) : null
      };
      const res = await fetch(`http://localhost:5000/api/exams/${editExamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(examData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Exam updated successfully ✅");
        resetForm(); setShowCreateForm(false); fetchExams();
      } else setError(data.message || "Failed to update exam");
    } catch (err) { setError("Failed to update exam ❌"); }
  };

  // Delete exam
  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { setSuccess("Exam deleted successfully ✅"); fetchExams(); }
      else setError("Failed to delete exam");
    } catch { setError("Failed to delete exam ❌"); }
  };

  // Start editing exam
  const handleEditExam = (exam) => {
    setEditExamId(exam._id);
    setTitle(exam.title);
    setExamType(exam.examType);
    setQuestionsDraft(exam.questions);
    setStartTime(exam.startTime ? new Date(exam.startTime).toISOString().slice(0, 16) : "");
    setEndTime(exam.endTime ? new Date(exam.endTime).toISOString().slice(0, 16) : "");
    setDuration(exam.duration ? exam.duration.toString() : "");
    setShowCreateForm(true);
  };

  // Cancel editing
  const handleCancelEdit = () => { resetForm(); setShowCreateForm(false); setError(""); setSuccess(""); };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Exam Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : 'Create New Exam'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">{success}</div>}

      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{editExamId ? 'Edit Exam' : 'Create New Exam'}</h3>
          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter exam title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select value={examType} onChange={handleExamTypeChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="mcq">MCQ</option>
                <option value="coding">Coding</option>
                <option value="theory">Theory</option>
              </select>
            </div>
          </div>

          {/* MCQ Builder */}
          {examType === 'mcq' && (
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <h4 className="text-md font-medium text-gray-900 mb-3">Add MCQ Question</h4>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <textarea value={question} onChange={e => setQuestion(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3" placeholder="Enter question text" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="w-6 text-sm text-gray-500">{String.fromCharCode(65 + index)}.</span>
                    <input type="text" value={option} onChange={e => {
                      const newOptions = [...options]; newOptions[index] = e.target.value; setOptions(newOptions);
                    }}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`} />
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                <select value={correctAnswer} onChange={e => setCorrectAnswer(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {options.map((_, index) => (
                    <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">Add Question</button>
            </div>
          )}

          {/* Coding Builder */}
          {examType === 'coding' && (
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <h4 className="text-md font-medium text-gray-900 mb-3">Create Coding Question</h4>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
                <textarea value={codingProblem} onChange={e => setCodingProblem(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4" placeholder="Enter detailed problem statement" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Starter Code (Optional)</label>
                <textarea value={starterCode} onChange={e => setStarterCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  rows="4" placeholder="// Provide starter code for students" />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Languages</label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {Object.entries({ javascript: "JavaScript", python: "Python", c: "C", cpp: "C++", java: "Java" }).map(([key, label]) => (
                    <label key={key} className="inline-flex items-center">
                      <input type="checkbox" checked={allowedLanguages[key]}
                        onChange={e => setAllowedLanguages({ ...allowedLanguages, [key]: e.target.checked })}
                        className="mr-1" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Test Cases</label>
                  <button type="button" onClick={() => setTestCases([...testCases, { input: "", expected: "" }])}
                    className="text-sm text-blue-600 hover:text-blue-800">+ Add Test Case</button>
                </div>
                {testCases.map((testCase, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2 p-2 border border-gray-200 rounded">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Input</label>
                      <textarea value={testCase.input} onChange={e => {
                        const newTestCases = [...testCases]; newTestCases[index].input = e.target.value; setTestCases(newTestCases);
                      }}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" rows="2" placeholder="Test input" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <label className="block text-xs text-gray-600 mb-1">Expected Output</label>
                        {testCases.length > 1 && <button type="button" onClick={() => {
                          const newTestCases = [...testCases]; newTestCases.splice(index, 1); setTestCases(newTestCases);
                        }} className="text-xs text-red-600 hover:text-red-800">Remove</button>}
                      </div>
                      <textarea value={testCase.expected} onChange={e => {
                        const newTestCases = [...testCases]; newTestCases[index].expected = e.target.value; setTestCases(newTestCases);
                      }}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono" rows="2" placeholder="Expected output" />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => {
                setError(""); setSuccess("");
                if (!codingProblem.trim()) { setError("Problem statement is required"); return; }
                if (!Object.values(allowedLanguages).some(v => v)) { setError("At least one programming language must be selected"); return; }
                const validTestCases = testCases.filter(tc => tc.input.trim() && tc.expected.trim());
                if (validTestCases.length === 0) { setError("At least one complete test case is required"); return; }
                const codingQuestion = { question: codingProblem, options: [starterCode || "// Write your code here"], correctAnswer: 0, starterCode: starterCode || "", testcases: validTestCases };
                setQuestionsDraft([codingQuestion]); setSuccess("Coding question added ✅");
              }} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">Add Coding Question</button>
            </div>
          )}

          {/* Start/End/Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
            </div>
          </div>

          {/* Questions Draft */}
          {questionsDraft.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Questions ({questionsDraft.length})</h4>
              <div className="space-y-2">
                {questionsDraft.map((q, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{q.question}</p>
                      <div className="mt-1 text-sm text-gray-600">
                        {q.options.map((option, optIndex) => (
                          <span key={optIndex} className={optIndex === q.correctAnswer ? 'font-bold text-green-600' : ''}>
                            {String.fromCharCode(65 + optIndex)}. {option}{optIndex === q.correctAnswer && ' ✓'}{" "}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleRemoveQuestion(index)}
                      className="text-red-600 hover:text-red-800 ml-2">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={editExamId ? handleUpdateExam : handleCreateExam}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              {editExamId ? 'Update Exam' : 'Create Exam'}
            </button>
            <button onClick={handleCancelEdit}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Exams List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Existing Exams</h3>
        {exams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No exams created yet</p>
        ) : exams.map(exam => (
          <div key={exam._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{exam.title}</h4>
                <p className="text-sm text-gray-600">Type: {exam.examType.toUpperCase()}</p>
                <p className="text-sm text-gray-600">Questions: {exam.questions.length}</p>
                {exam.startTime && <p className="text-sm text-gray-600">Start: {new Date(exam.startTime).toLocaleString()}</p>}
                {exam.endTime && <p className="text-sm text-gray-600">End: {new Date(exam.endTime).toLocaleString()}</p>}
                {exam.duration && <p className="text-sm text-gray-600">Duration: {exam.duration} minutes</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditExam(exam)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button onClick={() => handleDeleteExam(exam._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamManagement;