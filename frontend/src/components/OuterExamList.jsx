import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OuterExamList() {
  const [exams, setExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      fetchExamResults(savedUser);
    }
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch only OUTER exams
      const response = await fetch('http://localhost:5000/api/exams?targetRole=OUTER', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamResults = async (userData = user) => {
    try {
      const studentId = userData?._id || userData?.id;
      if (!studentId) return;

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/results/${studentId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setExamResults(data);
      }
    } catch (error) {
      console.error('Error fetching exam results:', error);
    }
  };

  const getExamStatus = (examId) => {
    const result = examResults.find(r => {
      const resultExamId = r.examId?._id || r.examId;
      return String(resultExamId) === String(examId);
    });
    
    // Outer users only see "Completed" or "Not Attempted" - NO SCORE
    if (result) {
      return { status: 'Completed' };
    }
    return { status: 'Not Attempted' };
  };

  const isExamAvailable = (exam) => {
    const now = new Date();
    const startTime = exam.startTime ? new Date(exam.startTime) : null;
    const endTime = exam.endTime ? new Date(exam.endTime) : null;

    if (startTime && now < startTime) return false;
    if (endTime && now > endTime) return false;
    return true;
  };

  const getExamStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Not Attempted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading exams...</div></div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Available Exams</h2>
      
      {exams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No exams available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map(exam => {
            const examStatus = getExamStatus(exam._id);
            const available = isExamAvailable(exam);

            return (
              <div key={exam._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {exam.examType.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Questions:</span> {exam.questions.length}
                  </p>
                  {exam.duration && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {exam.duration} minutes
                    </p>
                  )}
                  {exam.startTime && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Start Time:</span> {new Date(exam.startTime).toLocaleString()}
                    </p>
                  )}
                  {exam.endTime && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">End Time:</span> {new Date(exam.endTime).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getExamStatusColor(examStatus.status)}`}>
                    {examStatus.status}
                  </span>
                </div>

                {examStatus.status === 'Not Attempted' && available && (
                  <button
                    onClick={() => handleStartExam(exam._id)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Start Exam
                  </button>
                )}

                {examStatus.status === 'Completed' && (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed"
                  >
                    Completed
                  </button>
                )}

                {!available && examStatus.status !== 'Completed' && (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed"
                  >
                    Not Available
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OuterExamList;
