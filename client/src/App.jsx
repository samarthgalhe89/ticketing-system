// client/src/App.jsx (snippet)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import StaffDashboard from './pages/StaffDashboard'; // <-- NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} /> 

        {/* Employee Dashboard */}
        <Route path="/dashboard" element={<EmployeeDashboard />} />

        {/* Staff/Admin Dashboard */}
        <Route path="/staff" element={<StaffDashboard />} /> {/* <-- NEW ROUTE */}
        
        {/* Add a simple fallback for 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;