// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    // Using staff credentials for full test flow
    const [email, setEmail] = useState('staff@powergrid.in');
    const [password, setPassword] = useState('staffpass'); 
    const navigate = useNavigate();

    // --- Enterprise Styling Constants ---
    const primaryColor = '#4A6572';     // Deep Slate Gray/Teal (Accent)
    const secondaryColor = '#6A99A8';   // Lighter accent for hover
    const pageBgColor = '#2C3E50';      // Deep Charcoal Gray for full background
    const cardColor = '#F7F9FB';        // <-- NEW: Very light, subtle gray for the card
    const borderColor = '#C4D3DD';      // Soft input border
    const focusBorderColor = '#6A99A8'; // Focus accent color
    const shadowStyle = '0 6px 20px rgba(0, 0, 0, 0.2)'; 

    const pageWrapperStyle = {
        backgroundColor: pageBgColor,
        minHeight: '100vh',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        // --- NEW: FLEXBOX for Perfect Centering ---
        display: 'flex',
        alignItems: 'center', // Vertical Center
        justifyContent: 'center', // Horizontal Center
    };

    const formContainerStyle = {
        padding: '40px',
        maxWidth: '450px',
        width: '100%', // Ensure it respects maxWidth in the center
        backgroundColor: cardColor, // Applied subtle gray
        borderRadius: '12px',
        boxShadow: shadowStyle,
        textAlign: 'center',
        margin: '0 auto' // Reset margin due to flex centering
    };

    const inputStyle = {
        display: 'block',
        margin: '15px 0',
        padding: '12px 15px',
        width: '100%',
        boxSizing: 'border-box',
        border: `1px solid ${borderColor}`,
        borderRadius: '6px',
        fontSize: '16px',
        color: '#333',
        transition: 'border-color 0.3s, box-shadow 0.3s'
    };

    const buttonStyle = {
        padding: '12px 25px',
        cursor: 'pointer',
        backgroundColor: primaryColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        width: '100%',
        marginTop: '20px',
        transition: 'background-color 0.2s, transform 0.2s'
    };

    // Logic for dynamic input focus styles
    const handleFocus = (e) => {
        e.target.style.borderColor = focusBorderColor; 
        e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}40`;
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = borderColor;
        e.target.style.boxShadow = 'none';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3030/api/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userRole', res.data.role);

            if (res.data.role === 'employee') {
                navigate('/dashboard'); 
            } else {
                navigate('/staff'); 
            }
            
        } catch (err) {
            alert('Login failed: Invalid Credentials or Server Error.');
            console.error(err);
        }
    };

    return (
        <div style={pageWrapperStyle}>
            
            <div style={formContainerStyle}>
                <h1 style={{ color: primaryColor, marginBottom: '5px', fontSize: '28px' }}>
                    POWERGRID Helpdesk
                </h1>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
                    Secure Sign in to your IT Service Portal
                </p>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email (staff@powergrid.in)" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <input 
                        type="password" 
                        placeholder="Password (staffpass)" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <button 
                        type="submit" 
                        style={buttonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = secondaryColor} 
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Secure Sign In
                    </button>
                </form>
                
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: primaryColor, textDecoration: 'none' }}>Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;