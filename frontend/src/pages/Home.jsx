import React from "react";
import teamImg from "../assets/team.jpg";
import mainPic1 from "../assets/mainPic1.jpg";
import mainPic2 from "../assets/mainPic2.jpg";

export default function Home() {
  return (
    <div className="p-0">
      {/* Image occupies half of the viewport height and is fully visible */}
      <div className="w-full h-[50vh] bg-black flex items-center justify-center">
        <img
          src="/peopletech/ptg background.png"
          alt="PeopleTech background"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Placeholder for remaining half content */}
        <div className="w-full min-h-[50vh] p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-100">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4 text-center drop-shadow-lg">Welcome to PeopleTech LMS Portal</h1>
          <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl">Empowering interns and admins with seamless exam management, training resources, and real-time status tracking. Experience a modern, secure, and user-friendly platform for your learning and assessment journey.</p>
          <div className="flex flex-wrap gap-12 justify-center items-center mb-16">
           <img src={mainPic1} alt="Empowering Growth" className="w-64 h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform" />
           <img src={teamImg} alt="Team" className="w-64 h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform" />
           <img src={mainPic2} alt="Grow Achieve Excel" className="w-64 h-48 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform" />
          </div>
          <div className="flex flex-col md:flex-row gap-30 justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 text-center hover:scale-105 transition-transform">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Exam Management</h2>
              <p className="text-gray-600 text-lg">Easily schedule, monitor, and review exams for all interns with robust admin controls.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 text-center hover:scale-105 transition-transform">
              <h2 className="text-2xl font-bold text-pink-700 mb-4">Training Resources</h2>
              <p className="text-gray-600 text-lg">Access curated training videos, documents, and interactive learning modules.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 w-96 text-center hover:scale-105 transition-transform">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Status Tracking</h2>
              <p className="text-gray-600 text-lg">Track exam progress, reconnections, and results in real-time for every intern.</p>
            </div>
          </div>
        </div>
    </div>
  );
}


