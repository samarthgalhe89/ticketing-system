// client/src/components/TicketForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function TicketForm({ onTicketCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('Low');
    const [response, setResponse] = useState(null); 

    const primaryColor = '#4A6572';
    const accentColor = '#6A99A8';
    const errorColor = '#D32F2F';
    const successColor = '#4CAF50';
    const borderColor = '#E5E9EC';
    const inputBgColor = '#F7F9FB';
    const focusBorderColor = '#9ABBCD';

    const baseInputStyle = {
        width: '100%',
        padding: '12px',
        margin: '5px 0 15px 0',
        border: `1px solid ${borderColor}`,
        borderRadius: '6px',
        backgroundColor: inputBgColor,
        fontSize: '15px'
    };

    const labelStyle = { display: 'block', fontWeight: '600', color: primaryColor, marginTop: '10px', marginBottom: '5px' };
    const buttonStyle = { padding: '10px 20px', backgroundColor: primaryColor, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginTop: '10px', width: '100%' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse(null);
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in first.');

        try {
            const res = await axios.post('http://localhost:3030/api/tickets',
                { title, description, urgency },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newTicket = res.data; // <-- full ticket object from server

            setResponse({ type: 'TICKET_CREATED', data: newTicket });

            setTitle('');
            setDescription('');
            setUrgency('Low');

            // **Notify parent immediately**
            if (onTicketCreated) onTicketCreated(newTicket);

        } catch (err) {
            console.error(err);
            setResponse({ type: 'ERROR', message: 'Failed to create ticket. Check server!' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="ticketTitle" style={labelStyle}>Title:</label>
            <input
                id="ticketTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={baseInputStyle}
            />

            <label htmlFor="ticketDescription" style={labelStyle}>Description:</label>
            <textarea
                id="ticketDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ ...baseInputStyle, height: '100px' }}
            />

            <label htmlFor="ticketUrgency" style={labelStyle}>Urgency:</label>
            <select
                id="ticketUrgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                style={baseInputStyle}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <button type="submit" style={buttonStyle}>Submit Ticket</button>

            {response && response.type === 'ERROR' && (
                <p style={{ color: errorColor, marginTop: '10px' }}>{response.message}</p>
            )}
        </form>
    );
}

export default TicketForm;
