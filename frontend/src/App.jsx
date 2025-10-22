import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MainAdminDashboard from "./pages/MainAdminDashboard";
import SubAdminDashboard from "./pages/SubAdminDashboard";
import InternDashboard from "./pages/InternDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminStudentProfile from "./pages/AdminStudentProfile";
import TrainingPortal from "./pages/TrainingPortal";
import StudentTrainingView from "./pages/StudentTrainingView";
import SchedulePortal from "./pages/SchedulePortal";
import StudentScheduleView from "./pages/StudentScheduleView";
import ExamPage from "./pages/ExamPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Intern-only routes */}
          <Route
            path="/intern/dashboard"
            element={
              <PrivateRoute allowedRoles={["INTERN"]}>
                <InternDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["INTERN", "student"]}>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/training"
            element={
              <PrivateRoute allowedRoles={["INTERN", "student"]}>
                <StudentTrainingView />
              </PrivateRoute>
            }
          />

          <Route
            path="/schedules"
            element={
              <PrivateRoute allowedRoles={["INTERN", "student"]}>
                <StudentScheduleView />
              </PrivateRoute>
            }
          />

          {/* Take Exam (intern/student) */}
          <Route
            path="/exam/:id"
            element={
              <PrivateRoute allowedRoles={["INTERN", "student"]}>
                <ExamPage />
              </PrivateRoute>
            }
          />

          {/* Main Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["MAIN_ADMIN"]}>
                <MainAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["MAIN_ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute allowedRoles={["MAIN_ADMIN"]}>
                <AdminStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students/:studentId"
            element={
              <PrivateRoute allowedRoles={["MAIN_ADMIN"]}>
                <AdminStudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/training"
            element={
              <PrivateRoute allowedRoles={["MAIN_ADMIN"]}>
                <TrainingPortal />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <PrivateRoute allowedRoles={["MAIN_ADMIN"]}>
                <SchedulePortal />
              </PrivateRoute>
            }
          />

          {/* Sub Admin routes */}
          <Route
            path="/subadmin/dashboard"
            element={
              <PrivateRoute allowedRoles={["SUB_ADMIN"]}>
                <SubAdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
