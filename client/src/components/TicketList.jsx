// client/src/components/TicketList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Enterprise Styling Constants ---
    const primaryColor = '#4A6572';     // Deep Slate Gray/Teal
    const cardBgColor = '#F7F9FB';      // Very light gray for card interior
    const borderColor = '#E5E9EC';      // Soft border color
    const hoverBorderColor = '#9ABBCD'; // Lighter blue for hover
    const hoverShadow = '0 6px 16px rgba(0,0,0,0.1)'; // Enhanced shadow on hover
    
    // Muted/Dark Pastel Shades for Status Badges
    const statusColors = {
        'Resolved': { bg: '#4CAF50', text: 'white' }, 
        'Closed': { bg: '#888888', text: 'white' },   
        'In Progress': { bg: '#FFB347', text: 'white' },
        'Open': { bg: '#EF5350', text: 'white' },      
        'default': { bg: '#BBDEFB', text: primaryColor }
    };

    const getToken = () => localStorage.getItem('token');

    const fetchTickets = async () => {
        const token = getToken();
        if (!token) {
            setError("No user token found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get('http://localhost:3030/api/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError("Failed to load tickets. Ensure backend is running.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 10000); 
        return () => clearInterval(interval); 
    }, []);

    const getStatusStyle = (status) => {
        const colors = statusColors[status] || statusColors.default;
        return { 
            backgroundColor: colors.bg, 
            color: colors.text, 
            padding: '4px 10px', 
            borderRadius: '15px', 
            fontWeight: '600',
            fontSize: '12px',
            textTransform: 'uppercase'
        };
    };

    if (loading) {
        return <p style={{ color: primaryColor }}>Loading "My Tickets"...</p>;
    }

    if (error) {
        return <div style={{ color: errorColor, border: `1px solid ${errorColor}`, padding: '10px', borderRadius: '5px' }}>Error: {error}</div>;
    }
    
    if (tickets.length === 0) {
        return <p style={{ color: '#666' }}>You haven't submitted any tickets yet. Submit one now!</p>;
    }

    // --- Ticket Card Styles ---
    const ticketCardBaseStyle = { 
        border: `1px solid ${borderColor}`, 
        padding: '15px 20px', 
        marginBottom: '15px', 
        borderRadius: '8px',
        backgroundColor: cardBgColor,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.2s', // Smooth transitions
        cursor: 'pointer' // Indicates interactivity
    };

    return (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {tickets.map((ticket) => (
                <div key={ticket._id} 
                    style={ticketCardBaseStyle}
                    // Hover effects
                    onMouseOver={(e) => { 
                        e.currentTarget.style.borderColor = hoverBorderColor; 
                        e.currentTarget.style.boxShadow = hoverShadow;
                        e.currentTarget.style.transform = 'translateY(-3px)'; // Subtle lift
                    }}
                    onMouseOut={(e) => { 
                        e.currentTarget.style.borderColor = borderColor; 
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; 
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    
                    <h4 style={{ margin: '0 0 8px 0', color: primaryColor, fontSize: '16px' }}>
                        {ticket.title} 
                        <span style={{ float: 'right', fontWeight: 'normal', color: '#888', fontSize: '12px' }}>
                            Ticket ID: #{ticket._id.slice(-6)}
                        </span>
                    </h4>
                    
                    <p style={{ margin: '5px 0', color: '#333' }}>
                        {ticket.description}
                    </p>
                    
                    <div style={{ marginTop: '15px', borderTop: `1px dashed ${borderColor}`, paddingTop: '10px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <p style={{ margin: '0' }}>
                                **Status:** <span style={getStatusStyle(ticket.status)}>{ticket.status}</span>
                            </p>
                            <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
                                **Category (AI):** {ticket.category || 'Unassigned'}
                            </p>
                            <p style={{ margin: '0', fontSize: '14px', color: ticket.urgency === 'High' ? '#D32F2F' : '#555' }}>
                                **Urgency:** {ticket.urgency}
                            </p>
                        </div>
                        
                        <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>
                            Submitted on: {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TicketList;