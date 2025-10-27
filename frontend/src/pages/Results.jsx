import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Use env variable for backend URL

function Results() {
  const { studentId } = useParams(); // 👈 get studentId from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/results/${studentId}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId]);

  if (loading) return <p className="p-6">Loading results...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Exam Results 📊</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Exam Title</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Total Questions</th>
              <th className="p-2 border">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td className="p-2 border">{result.examTitle}</td>
                <td className="p-2 border">{result.score}</td>
                <td className="p-2 border">{result.totalQuestions}</td>
                <td className="p-2 border">
                  {new Date(result.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Results;
