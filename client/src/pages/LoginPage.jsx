// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    // State to hold user input and dynamic demo credentials
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const navigate = useNavigate();

    // --- DEMO CREDENTIALS for quick switching (Must match DB plaintext passwords) ---
    const demoUsers = {
        // NOTE: The 'hashedpassword' for employee must be updated to a plaintext password like 'employeepass' in your DB and here.
        'employee': { email: 'john@example.com', password: 'employeepass' }, 
        'staff': { email: 'staff@powergrid.in', password: 'staffpass' },
        'admin': { email: 'admin@powergrid.in', password: 'adminpass' }
    };
    
    // --- Enterprise Styling Constants ---
    const primaryColor = '#4A6572'; 
    const secondaryColor = '#6A99A8'; 
    const pageBgColor = '#2C3E50'; 
    const cardColor = '#F7F9FB'; 
    const borderColor = '#C4D3DD'; 
    const focusBorderColor = '#6A99A8'; 
    const shadowStyle = '0 6px 20px rgba(0, 0, 0, 0.2)'; 

    const pageWrapperStyle = {
        backgroundColor: pageBgColor,
        minHeight: '100vh',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center', 
    };

    const formContainerStyle = {
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        backgroundColor: cardColor,
        borderRadius: '12px',
        boxShadow: shadowStyle,
        textAlign: 'center',
        margin: '0 auto'
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

    // --- Dynamic Handlers ---
    const handleFocus = (e) => {
        e.target.style.borderColor = focusBorderColor; 
        e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}40`;
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = borderColor;
        e.target.style.boxShadow = 'none';
    };

    const handleRoleSelect = (role) => {
        if (role && demoUsers[role]) {
            setEmail(demoUsers[role].email);
            setPassword(demoUsers[role].password);
        } else {
            setEmail('');
            setPassword('');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3030/api/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userRole', res.data.role); 

            // --- CORRECTED REDIRECTION LOGIC ---
            if (res.data.role === 'employee') {
                navigate('/dashboard'); 
            } else if (res.data.role === 'staff') {
                navigate('/staff'); // Staff goes to ticket management dashboard
            } else if (res.data.role === 'admin') {
                navigate('/admin'); // Admin goes to the analytics-focused dashboard
            }
            // -----------------------------------
            
        } catch (err) {
            alert('Login failed: Invalid Credentials. Check your database hash/password.');
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

                {/* Role Selector for easy demo */}
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: primaryColor, fontWeight: 'bold' }}>Demo Role Switcher:</label>
                    <select
                        onChange={(e) => handleRoleSelect(e.target.value)}
                        style={inputStyle}
                        defaultValue="" 
                    >
                        <option value="" disabled>-- Select Role for Demo --</option>
                        <option value="employee">Employee (Test User)</option>
                        <option value="staff">IT Staff</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
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