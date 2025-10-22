import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InternExamList() {
  const [exams, setExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage like Profile component does
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      console.log("Using saved user from localStorage:", savedUser);
      setUser(savedUser);
      // Fetch exam results immediately if user is available
      fetchExamResults(savedUser);
    }
    
    // Initial fetch
    fetchExams();
    
    // Set up periodic refresh every 30 seconds to check for deleted exams
    const refreshInterval = setInterval(() => {
      fetchExams();
      if (user) {
        fetchExamResults();
      }
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Fetch exam results when user is loaded
  useEffect(() => {
    if (user) {
      fetchExamResults();
    }
  }, [user]);


  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/exams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Exams fetched:", data);
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
      if (!studentId) {
        console.log("No student ID found in user object:", userData);
        return;
      }
      
      console.log("Fetching exam results for studentId:", studentId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/results/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Exam results fetched:", data);
        setExamResults(data);
      } else {
        console.error("Failed to fetch exam results:", response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching exam results:', error);
    }
  };

  const getExamStatus = (examId) => {
    console.log("Getting exam status for examId:", examId, "type:", typeof examId);
    console.log("Available exam results:", examResults);
    
    const result = examResults.find(r => {
      const resultExamId = r.examId?._id || r.examId;
      console.log("Comparing resultExamId:", resultExamId, "type:", typeof resultExamId, "with examId:", examId);
      console.log("Strict equality:", resultExamId === examId);
      console.log("String equality:", String(resultExamId) === String(examId));
      return resultExamId === examId;
    });
    
    console.log("Found result:", result);
    
    if (result) {
      return {
        status: 'Completed',
        score: result.score,
        total: result.totalQuestions,
        submittedAt: new Date(result.createdAt).toLocaleString()
      };
    }
    return { status: 'Not Attempted', score: 0, total: 0, submittedAt: null };
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
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Loading exams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Exams</h2>
      
      {exams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No exams available at the moment
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => {
            console.log("Rendering exam:", exam.title, "with ID:", exam._id);
            const status = getExamStatus(exam._id);
            const available = isExamAvailable(exam);
            
            return (
              <div key={exam._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                    <div className="mt-2 space-y-1">
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
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExamStatusColor(status.status)}`}>
                        {status.status}
                      </span>
                    </div>
                    
                    {status.status === 'Completed' && (
                      <div className="text-sm text-gray-600 mb-2">
                        Score: {status.score}/{status.total}
                      </div>
                    )}
                    
                    {status.status === 'Completed' && status.submittedAt && (
                      <div className="text-sm text-gray-600 mb-2">
                        Submitted: {status.submittedAt}
                      </div>
                    )}
                    
                    {available && status.status !== 'Completed' && (
                      <button
                        onClick={() => handleStartExam(exam._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Start Exam
                      </button>
                    )}
                    
                    {!available && (
                      <div className="text-sm text-gray-500">
                        {new Date() < new Date(exam.startTime) ? 'Not yet available' : 'Exam ended'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Results Summary */}
      {examResults.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Exam Results</h3>
          <div className="space-y-2">
            {examResults.map(result => {
              const exam = exams.find(e => e._id === result.examId);
              return (
                <div key={result._id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="font-medium">{exam?.title || result.examId?.title || 'Unknown Exam'}</span>
                    <span className="text-sm text-gray-600 ml-2">({result.examType.toUpperCase()})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      {result.score}/{result.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default InternExamList;
