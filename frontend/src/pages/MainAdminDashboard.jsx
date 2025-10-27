import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'INTERN',
    employeeId: '',
    companyEmail: '',
    personalEmail: '',
    contactNumber: '',
    username: '',
    gender: '',
    phoneNumber: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Use environment-based backend URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role' && value === 'OUTER') {
      setFormData({
        ...formData,
        [name]: value,
        username: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      const url = editingUser 
        ? `${API_BASE_URL}/api/admin/users/${editingUser._id}`
        : `${API_BASE_URL}/api/auth/register`;
      
      const method = editingUser ? 'PUT' : 'POST';
      let submitData = { ...formData };

      if (submitData.role === "OUTER" && (!submitData.username || submitData.username.trim() === "")) {
        delete submitData.username;
      }

      ['username', 'companyEmail', 'employeeId'].forEach(field => {
        if (submitData[field] === "") delete submitData[field];
      });

      if (formData.role === 'OUTER' && formData.dateOfBirth) {
        const date = new Date(formData.dateOfBirth);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        submitData.dateOfBirth = `${day}-${month}-${year}`;
        submitData.password = `${day}${month}${year}`;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setEditingUser(null);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'INTERN',
          employeeId: '',
          companyEmail: '',
          personalEmail: '',
          contactNumber: '',
          username: '',
          gender: '',
          phoneNumber: '',
          dateOfBirth: ''
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        if (errorData.message) {
          const fieldMap = {
            "Email already registered": "email",
            "Username already taken": "username",
            "Mobile number already registered": "contactNumber",
            "Employee ID already exists": "employeeId",
            "Company email already registered": "companyEmail"
          };
          const field = fieldMap[errorData.message];
          if (field) setErrors(prev => ({ ...prev, [field]: errorData.message }));
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      employeeId: user.employeeId || '',
      companyEmail: user.companyEmail || '',
      personalEmail: user.personalEmail || '',
      contactNumber: user.contactNumber || '',
      username: user.username || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const downloadInternsJson = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/interns/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'interns.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // (UI part remains unchanged)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Rest of your JSX is unchanged */}
      {/* ... */}
    </div>
  );
}

export default MainAdminDashboard;
