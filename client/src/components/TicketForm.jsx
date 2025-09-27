// client/src/components/TicketForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function TicketForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('Low');
    const [response, setResponse] = useState(null); 

    // --- Enterprise Styling Constants (from previous, consistent) ---
    const primaryColor = '#4A6572';     // Deep Slate Gray/Teal
    const accentColor = '#6A99A8';      // Slightly lighter accent for hover
    const errorColor = '#D32F2F';       // Muted Red
    const successColor = '#4CAF50';     // Muted Green
    const borderColor = '#E5E9EC';      // Soft border color
    const inputBgColor = '#F7F9FB';     // Very light gray for input background
    const focusBorderColor = '#9ABBCD'; // Lighter blue for focus state
    // ---------------------------------------------------

    // Base style for input fields and select
    const baseInputStyle = {
        width: '100%',
        padding: '12px',
        margin: '5px 0 15px 0',
        border: `1px solid ${borderColor}`,
        borderRadius: '6px',
        boxSizing: 'border-box',
        backgroundColor: inputBgColor,
        resize: 'vertical',
        fontSize: '15px',
        transition: 'border-color 0.3s, box-shadow 0.3s' // Smooth transition for focus
    };

    const labelStyle = {
        display: 'block',
        fontWeight: '600',
        color: primaryColor,
        marginTop: '10px',
        marginBottom: '5px'
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: primaryColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        marginTop: '10px',
        width: '100%', // Make button full width
        transition: 'background-color 0.2s, transform 0.2s' // Smooth transition for hover/active
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse(null); 

        const token = localStorage.getItem('token');
        if (!token) {
            return alert('Please log in first.');
        }

        try {
            const res = await axios.post('http://localhost:3030/api/tickets', 
                { title, description, urgency }, 
                { headers: { Authorization: `Bearer ${token}` } } 
            );

            if (res.data.status === 'Resolved') {
                setResponse({ type: 'KB_RESOLVE', data: res.data });
            } else {
                setResponse({ type: 'TICKET_CREATED', data: res.data });
            }

            setTitle('');
            setDescription('');

        } catch (err) {
            console.error(err);
            setResponse({ type: 'ERROR', message: 'Failed to create ticket. Check both servers!' });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                
                <label htmlFor="ticketTitle" style={labelStyle}>Title (e.g., VPN not connecting):</label>
                <input 
                    id="ticketTitle"
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    style={baseInputStyle}
                    // Add focus styles for interactive feel
                    onFocus={(e) => { e.target.style.borderColor = focusBorderColor; e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}40`; }}
                    onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                />

                <label htmlFor="ticketDescription" style={labelStyle}>Description:</label>
                <textarea 
                    id="ticketDescription"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    style={{...baseInputStyle, height: '100px'}}
                    onFocus={(e) => { e.target.style.borderColor = focusBorderColor; e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}40`; }}
                    onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                />

                <label htmlFor="ticketUrgency" style={labelStyle}>Urgency:</label>
                <select 
                    id="ticketUrgency"
                    value={urgency} 
                    onChange={(e) => setUrgency(e.target.value)} 
                    style={baseInputStyle}
                    onFocus={(e) => { e.target.style.borderColor = focusBorderColor; e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}40`; }}
                    onBlur={(e) => { e.target.style.borderColor = borderColor; e.target.style.boxShadow = 'none'; }}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <button 
                    type="submit" 
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = accentColor} 
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} // Slight press effect
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Submit Ticket
                </button>
            </form>

            {/* Response Box (Smart Chatbot Output) */}
            {response && (
                <div style={{ 
                    marginTop: '25px', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: `1px solid ${response.type === 'ERROR' ? errorColor : successColor}`,
                    backgroundColor: response.type === 'ERROR' ? '#FEEEEE' : '#E8F5E9', 
                    color: '#333',
                    // Animation for response box appearing
                    animation: 'fadeIn 0.5s ease-out forwards',
                    '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
                }}>
                    {response.type === 'KB_RESOLVE' && (
                        <>
                            <h3 style={{ color: successColor, margin: '0 0 10px 0' }}>✅ Auto-Resolved by Knowledge Base!</h3>
                            <p style={{ margin: '0' }}><strong>Message:</strong> {response.data.message}</p>
                            <p style={{ margin: '5px 0 0 0' }}><strong>Solution:</strong> {response.data.kbSolution}</p>
                        </>
                    )}
                    {response.type === 'TICKET_CREATED' && (
                        <>
                            <h3 style={{ color: primaryColor, margin: '0 0 10px 0' }}>Ticket Created Successfully!</h3>
                            <p style={{ margin: '0' }}><strong>Category (AI Classified):</strong> {response.data.category}</p>
                            <p style={{ margin: '5px 0 0 0' }}>Your ticket ID is: {response.data._id.slice(-6)}</p>
                        </>
                    )}
                    {response.type === 'ERROR' && 
                        <h3 style={{ color: errorColor, margin: '0' }}>❌ Error: Failed to Submit Ticket</h3>}
                    
                    {response.type === 'ERROR' && <p style={{ marginTop: '10px' }}>{response.message}</p>}
                </div>
            )}
        </div>
    );
}

export default TicketForm;