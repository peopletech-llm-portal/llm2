import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InternExamList from '../components/InternExamList';

const API_URL = import.meta.env.VITE_API_URL;

function InternDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-2">Intern Dashboard</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exams
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <p className="mt-1 text-sm text-gray-900">{user?.employeeId || 'Not assigned'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.companyEmail || 'Not assigned'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Personal Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.personalEmail || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <p className="mt-1 text-sm text-gray-900">{user?.contactNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-sm text-gray-900">{user?.username || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/training')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-left"
              >
                View Training Materials
              </button>
              <button
                onClick={() => navigate('/schedules')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-left"
              >
                View Schedules
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-left"
              >
                Update Profile
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-gray-500 text-center py-8">
              <p>No recent activity to display</p>
            </div>
          </div>
        </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <InternExamList />
        )}
      </div>
    </div>
  );
}

export default InternDashboard;
