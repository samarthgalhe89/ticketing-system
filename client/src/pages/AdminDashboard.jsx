// client/src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StaffTicketList from '../components/StaffTicketList';
import AdminAnalytics from '../components/AdminAnalytics';

function AdminDashboard() {
    const navigate = useNavigate();
    
    // --- Styling Constants ---
    const pageBgColor = '#2C3E50';
    const cardColor = '#FFFFFF';
    const primaryColor = '#4A6572';
    const accentColor = '#6A99A8';
    const shadowStyle = '0 6px 20px rgba(0, 0, 0, 0.2)'; 

    const pageStyle = {
        padding: '30px',
        backgroundColor: pageBgColor,
        minHeight: '100vh',
        fontFamily: 'Segoe UI, Arial, sans-serif'
    };

    const cardContainerStyle = {
        padding: '25px',
        backgroundColor: cardColor,
        borderRadius: '10px',
        boxShadow: shadowStyle,
        marginBottom: '30px',
        borderLeft: `5px solid ${accentColor}`
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    return (
        <div style={pageStyle}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                
                {/* Header & Logout */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: cardColor, margin: '0', fontSize: '32px' }}>
                        SYSTEM ADMINISTRATOR DASHBOARD
                    </h1>
                    <button 
                        onClick={handleLogout} 
                        style={{ padding: '10px 25px', backgroundColor: '#D32F2F', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Logout
                    </button>
                </div>

                {/* 1. ANALYTICS & STATS SECTION */}
                <h2 style={{ color: cardColor, marginBottom: '20px', fontWeight: '400', fontSize: '24px' }}>
                    System Performance Overview
                </h2>
                <div style={cardContainerStyle}>
                    {/* The charts component for category distribution and open vs closed tickets */}
                    <AdminAnalytics />
                </div>
                
                {/* 2. LIVE TICKET OVERSIGHT SECTION */}
                <h2 style={{ color: cardColor, marginBottom: '20px', fontWeight: '400', fontSize: '24px' }}>
                    Live Ticket Oversight (Read-Only)
                </h2>
                <div style={cardContainerStyle}>
                    <p style={{ color: primaryColor, fontWeight: 'bold' }}>
                        Note: This view is read-only for system monitoring. Use the Staff Dashboard for management actions.
                    </p>
                    {/* Reusing StaffTicketList but disabling interaction for admin oversight */}
                    <StaffTicketList isReadOnly={true} /> 
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;