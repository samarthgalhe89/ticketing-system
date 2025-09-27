// client/src/pages/StaffDashboard.jsx
import React from 'react';
import StaffTicketList from '../components/StaffTicketList';

function StaffDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>IT Staff / Admin Dashboard</h1>
      <p>View, assign, and update all open and in-progress tickets across POWERGRID.</p>
      
      {/* Chart area will be added here later for Admin view */}
      {/* ---------------------------------------------------- */}

      <h2>Open & In-Progress Tickets</h2>
      <StaffTicketList />
    </div>
  );
}

export default StaffDashboard;

