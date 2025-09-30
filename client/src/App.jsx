// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page Components
import LoginPage from "./pages/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Employee Dashboard */}
        <Route path="/dashboard" element={<EmployeeDashboard />} />

        {/* Staff Dashboard (Ticket Management) */}
        <Route path="/staff" element={<StaffDashboard />} />

        {/* Admin Dashboard (Analytics Focus) */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
