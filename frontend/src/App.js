import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import InternDashboard from "./pages/InternDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    if (loggedInUser.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/intern/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      <Route
        path="/intern/dashboard"
        element={
          <ProtectedRoute allowedRole="intern">
            <InternDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              activePage="admin"
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/interns"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              activePage="interns"
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              activePage="analytics"
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/activity"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              activePage="activity"
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              activePage="profile"
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;