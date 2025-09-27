// client/src/pages/EmployeeDashboard.jsx
import React from 'react';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';

function EmployeeDashboard() {
    // --- Enterprise Styling Constants ---
    const primaryColor = 'white';     // Deep Slate Gray/Teal
    const secondaryColor = '#2C3E50';   // Very light, soothing background gray/blue
    const cardColor = '#FFFFFF';        // Clean card background
    const shadowStyle = '0 3px 10px rgba(0, 0, 0, 0.05)'; // Soft shadow

    // Style for the entire page background and structure
    const pageStyle = {
        backgroundColor: secondaryColor,
        minHeight: '100vh',
        padding: '30px',
        fontFamily: 'Segoe UI, Arial, sans-serif'
    };

    // Style for the individual panels (Form and List)
    const cardStyle = {
        padding: '25px',
        backgroundColor: cardColor,
        borderRadius: '8px',
        boxShadow: shadowStyle,
        border: '1px solid #E5E9EC', // Subtle border
        height: 'fit-content'
    };
    // ------------------------------------

    return (
        <div style={pageStyle}>
            <h1 style={{ color: primaryColor, marginBottom: '25px' }}>
                Employee Self-Service Portal
            </h1>
            
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                
                {/* Left Side: Ticket Creation (The Chatbot/Form Card) */}
                <div style={{ flex: 1, minWidth: '400px', ...cardStyle }}>
                    <h2 style={{ marginTop: '0', color: primaryColor, fontSize: '20px', borderBottom: '1px solid #ECECEC', paddingBottom: '10px' }}>
                        Raise New Ticket / Smart Chatbot
                    </h2>
                    <TicketForm />
                </div>

                {/* Right Side: My Tickets (The Dashboard List Card) */}
                <div style={{ flex: 2, ...cardStyle, minHeight: '600px' }}>
                    <h2 style={{ marginTop: '0', color: primaryColor, fontSize: '20px', borderBottom: '1px solid #ECECEC', paddingBottom: '10px' }}>
                        My Tickets
                    </h2>
                    <TicketList />
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;