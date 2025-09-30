// client/src/components/StaffTicketList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Accepts isReadOnly prop with a default value of false
function StaffTicketList({ isReadOnly = false }) { // <-- UPDATED FUNCTION SIGNATURE
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to get token (from storage)
    const getToken = () => localStorage.getItem('token');

    // --- Enterprise Styling Constants (Matching Dashboard UI) ---
    const primaryColor = '#4A6572';
    const cardBgColor = '#F7F9FB';
    const borderColor = '#E5E9EC';
    // -----------------------------------------------------------

    // Function to fetch ALL non-closed tickets
    const fetchStaffTickets = async () => {
        const token = getToken();
        if (!token) return setError("Login required.");

        try {
            // Calls the protected staff route
            const res = await axios.get('http://localhost:3030/api/staff/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Staff fetch error:', err.response || err);
            setError("Access Denied or Server Error. Check your user role.");
            setLoading(false);
        }
    };

    // Function to update ticket status (calls the protected PUT route)
    const handleStatusUpdate = async (ticketId, newStatus) => {
        if (isReadOnly) return; // Prevent updates if read-only is true

        const token = getToken();
        try {
            await axios.put(`http://localhost:3030/api/staff/tickets/${ticketId}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // After successful update, refresh the list to show changes
            fetchStaffTickets(); 
            // Note: Email notification happens on the backend
            alert(`Ticket ${ticketId.slice(-4)} status updated to ${newStatus}. Employee notified.`);
        } catch (err) {
            console.error('Update failed:', err.response || err);
            alert("Update failed. Check role authorization or network connection.");
        }
    };

    // Standard useEffect hook for data fetching on component load
    useEffect(() => {
        fetchStaffTickets();
    }, []);

    // --- Initial Render Checks ---
    if (loading) return <p>Loading Staff Dashboard...</p>;
    if (error) return <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>Error: {error}</div>;

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'High': return '#D32F2F';
            case 'Medium': return '#FFC107';
            default: return '#4CAF50';
        }
    };

    // --- Final Render ---
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {tickets.map((ticket) => (
                <div key={ticket._id} style={{ 
                    border: `1px solid ${borderColor}`, 
                    padding: '15px', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    backgroundColor: cardBgColor 
                }}>
                    <h4 style={{ margin: '0 0 5px 0', color: primaryColor }}>
                        Ticket #{ticket._id.slice(-6)}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', fontSize: '15px' }}>**Title:** {ticket.title}</p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>**Category:** {ticket.category || 'N/A'}</p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                        **Urgency:** <span style={{ color: getUrgencyColor(ticket.urgency), fontWeight: 'bold' }}>{ticket.urgency}</span>
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                        **Submitted by:** {ticket.createdBy?.name || 'Unknown'}
                    </p>
                    
                    {/* Conditional Rendering based on the new prop */}
                    {!isReadOnly ? ( // Show management dropdown for Staff
                        <>
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>**Current Status:**</p>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                                style={{ padding: '8px', width: '100%', marginTop: '5px', border: `1px solid ${primaryColor}` }}
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </>
                    ) : ( // Show read-only status for Admin oversight
                        <p style={{ marginTop: '10px', fontWeight: 'bold', color: primaryColor }}>Status: {ticket.status}</p> 
                    )}
                </div>
            ))}
        </div>
    );
}

export default StaffTicketList;