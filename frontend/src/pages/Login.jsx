import React, { useState } from "react";
import AuthBackground from "../components/AuthBackground";
import ParticlesBackground from "../components/ParticlesBackground";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", loginType: "admin" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For DOB (outer password field)
    if (name === "password" && form.loginType === "outer") {
      const numeric = value.replace(/\D/g, ""); // allow only numbers
      if (numeric.length <= 8) setForm({ ...form, [name]: numeric });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "MAIN_ADMIN") navigate("/admin/dashboard");
        else if (data.user.role === "SUB_ADMIN") navigate("/subadmin/dashboard");
        else if (data.user.role === "INTERN") navigate("/intern/dashboard");
        else if (data.user.role === "OUTER") navigate("/profile");
        else navigate("/profile");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Server error");
    }
  };

  const handleDateSelect = (e) => {
    if (form.loginType === "outer") {
      const date = new Date(e.target.value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dobFormat = `${day}${month}${year}`; // ddmmyyyy
      setForm({ ...form, password: dobFormat });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-0px)] flex items-center justify-center bg-white py-12 overflow-hidden">
      <AuthBackground />
      <ParticlesBackground />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl p-8 shadow-lg border border-zinc-200">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login Type */}
          <div>
            <label className="block text-sm text-zinc-700 mb-1">Login Type</label>
            <select
              name="loginType"
              value={form.loginType}
              onChange={handleChange}
              className="w-full bg-white border border-zinc-300 text-zinc-900 p-3 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400/60"
            >
              <option value="admin">Admin Login</option>
              <option value="intern">Intern Login</option>
              <option value="outer">Outer Login</option>
            </select>
          </div>

          {/* Email / Username */}
          <div>
            <label className="block text-sm text-zinc-700 mb-1">
              {form.loginType === 'intern'
                ? 'Company Email or Contact Number'
                : 'Email'}
            </label>
            <input
              type={form.loginType === 'intern' ? 'text' : 'email'}
              name="email"
              placeholder={
                form.loginType === 'intern'
                  ? 'jane@company.com or 9876543210'
                  : 'you@example.com'
              }
              onChange={handleChange}
              className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400/60"
              required
            />
          </div>

          {/* Password / DOB Field */}
          <div>
            <label className="block text-sm text-zinc-700 mb-1">
              {form.loginType === 'outer'
                ? 'Date of Birth (ddmmyyyy)'
                : 'Password'}
            </label>

            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={form.loginType === 'outer' ? 'ddmmyyyy' : '••••••••'}
                value={form.password}
                onChange={handleChange}
                className="w-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 p-3 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400/60"
                required
              />

              {/* 👇 Calendar icon only for outer login */}
              {form.loginType === "outer" && (
                <input
                  type="date"
                  onChange={handleDateSelect}
                  className="absolute right-10 opacity-0 cursor-pointer w-6 h-6"
                  title="Select Date"
                />
              )}

              {/* 👁️ Toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 flex items-center text-zinc-500 hover:text-zinc-700"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded hover:bg-zinc-800 transition"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
