
// client/src/components/StaffTicketList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StaffTicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to get token (from storage)
    const getToken = () => localStorage.getItem('token');

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
        const token = getToken();
        try {
            await axios.put(`http://localhost:3030/api/staff/tickets/${ticketId}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // After successful update, refresh the list to show changes
            fetchStaffTickets(); 
            alert(`Ticket ${ticketId.slice(-4)} status updated to ${newStatus}. Employee notified.`);
        } catch (err) {
            console.error('Update failed:', err.response || err);
            alert("Update failed. Check role authorization.");
        }
    };

    useEffect(() => {
        fetchStaffTickets();
    }, []);

    if (loading) return <p>Loading Staff Dashboard...</p>;
    if (error) return <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>Error: {error}</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {tickets.map((ticket) => (
                <div key={ticket._id} style={{ border: '1px solid #007bff', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
                    <h4 style={{ margin: '0', color: '#007bff' }}>Ticket #{ticket._id.slice(-6)}</h4>
                    <p><strong>Title:</strong> {ticket.title}</p>
                    <p><strong>Category:</strong> {ticket.category || 'N/A'}</p>
                    <p><strong>Urgency:</strong> <span style={{ color: ticket.urgency === 'High' ? 'red' : 'green' }}>{ticket.urgency}</span></p>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Submitted by:</strong> {ticket.createdBy?.name || 'Unknown'}</p>
                    
                    <select
                        value={ticket.status}
                        onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                        style={{ padding: '8px', width: '100%', marginTop: '10px' }}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            ))}
        </div>
    );
}

export default StaffTicketList;