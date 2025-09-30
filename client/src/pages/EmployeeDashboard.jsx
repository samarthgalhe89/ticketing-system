// client/src/pages/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';

function EmployeeDashboard() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [tickets, setTickets] = useState([]);

    const colors = {
        primary: '#4A6572',
        primaryDark: '#3A5260',
        secondary: '#EAEFF2',
        accent: '#5A9FD4',
        danger: '#E74C3C',
        dangerHover: '#C0392B',
        success: '#27AE60',
        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)',
        cardBg: '#FFFFFF',
        textLight: '#FFFFFF',
        textDark: '#2C3E50',
        shadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        shadowHover: '0 12px 35px rgba(0, 0, 0, 0.2)',
        border: '#E8EEF3'
    };

    const styles = {
        pageContainer: {
            background: colors.background,
            minHeight: '100vh',
            padding: '40px 30px',
            fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
            position: 'relative',
            overflow: 'hidden'
        },
        backgroundDecoration: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
                radial-gradient(circle at 20% 80%, rgba(90, 159, 212, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(74, 101, 114, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 45%),
                linear-gradient(45deg, transparent 40%, rgba(90, 159, 212, 0.03) 50%, transparent 60%)
            `,
            pointerEvents: 'none',
            zIndex: 0
        },
        contentWrapper: {
            position: 'relative',
            zIndex: 1,
            maxWidth: '1400px',
            margin: '0 auto'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            padding: '0 10px',
            animation: 'slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        },

        notification: {
            position: 'fixed',
            top: '80px',           // move it below header
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            zIndex: 9999,          // make sure it's on top of everything
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateX(400px)',
            opacity: 0
        },

        notificationSuccess: {
            background: `linear-gradient(135deg, ${colors.success} 0%, #22C55E 100%)`,
            boxShadow: `0 8px 25px ${colors.success}40, 0 0 0 1px rgba(255, 255, 255, 0.1)`
        },
        notificationError: {
            background: `linear-gradient(135deg, ${colors.danger} 0%, #DC2626 100%)`,
            boxShadow: `0 8px 25px ${colors.danger}40, 0 0 0 1px rgba(255, 255, 255, 0.1)`
        },
        notificationShow: {
            transform: 'translateX(0) scale(1)',
            opacity: 1
        },

        title: {
            color: colors.textLight,
            margin: '0',
            fontSize: '32px',
            fontWeight: '800',
            letterSpacing: '-0.8px',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E8EEF3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative'
        },
        subtitle: {
            color: colors.secondary,
            fontSize: '16px',
            fontWeight: '500',
            marginTop: '12px',
            opacity: 0.95,
            letterSpacing: '0.2px'
        },
        logoutButton: {
            padding: '14px 28px',
            background: `linear-gradient(135deg, ${colors.danger} 0%, #DC2626 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            letterSpacing: '0.5px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 6px 20px rgba(231, 76, 60, 0.3)`,
            position: 'relative',
            overflow: 'hidden',
            textTransform: 'uppercase'
        },
        logoutButtonHover: {
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: `0 10px 25px rgba(231, 76, 60, 0.4)`,
            background: `linear-gradient(135deg, ${colors.dangerHover} 0%, #B91C1C 100%)`
        },
        mainContent: {
            display: 'flex',
            gap: '50px',
            alignItems: 'flex-start'
        },
        leftCard: {
            flex: 1,
            minWidth: '450px',
            padding: '35px',
            background: `linear-gradient(145deg, ${colors.cardBg} 0%, #F8FAFC 100%)`,
            borderRadius: '20px',
            boxShadow: `${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
            border: `1px solid ${colors.border}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both'
        },
        rightCard: {
            flex: 2,
            padding: '35px',
            background: `linear-gradient(145deg, ${colors.cardBg} 0%, #F8FAFC 100%)`,
            borderRadius: '20px',
            boxShadow: `${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
            border: `1px solid ${colors.border}`,
            minHeight: '750px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both'
        },
        cardHeader: {
            marginTop: '0',
            marginBottom: '30px',
            color: colors.primary,
            fontSize: '24px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            borderBottom: `3px solid ${colors.secondary}`,
            paddingBottom: '18px',
            position: 'relative'
        },
        cardHeaderAccent: {
            position: 'absolute',
            bottom: '-3px',
            left: '0',
            width: '80px',
            height: '3px',
            background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
            borderRadius: '3px',
            animation: 'expandWidth 1s cubic-bezier(0.4, 0, 0.2, 1) 1s both'
        },
        cardGlow: {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: `
                linear-gradient(135deg, ${colors.accent}20 0%, transparent 50%, ${colors.primary}15 100%),
                radial-gradient(circle at 70% 30%, ${colors.accent}10 0%, transparent 50%)
            `,
            opacity: '0',
            transition: 'opacity 0.5s ease',
            borderRadius: '20px',
            pointerEvents: 'none'
        },
        statusDot: {
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${colors.success} 0%, #22C55E 100%)`,
            display: 'inline-block',
            marginRight: '10px',
            animation: 'pulse 2.5s infinite',
            boxShadow: `0 0 10px ${colors.success}40`
        },

        cardDescription: {
            color: '#64748B',
            marginBottom: '25px',
            fontSize: '15px',
            lineHeight: '1.7',
            fontWeight: '500',
            letterSpacing: '0.1px'
        }
    };

    // Fetch tickets on mount (unchanged)
    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:3030/api/tickets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setTickets(data);
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
            }
        };
        fetchTickets();
    }, []);

    // Delete handler (unchanged)
    const handleDeleteTicket = async (ticketId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this ticket?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3030/api/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setTickets(prev => prev.filter(t => t._id !== ticketId));
                showNotification('Ticket deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete ticket');
            }
        } catch (err) {
            console.error(err);
            showNotification('Failed to delete ticket.', 'error');
        }
    };

    // Ticket created handler (unchanged)
    const handleTicketCreated = (newTicket) => {
        setTickets(prev => [newTicket, ...prev]);
        showNotification('Ticket created successfully!', 'success');
    };

    // Enhanced notification system
    const showNotification = (message, type) => {
        const notification = document.getElementById('notification');
        if (!notification) return;
        notification.textContent = message;
        Object.assign(notification.style, styles.notification, type === 'success' ? styles.notificationSuccess : styles.notificationError);
        setTimeout(() => Object.assign(notification.style, styles.notificationShow), 150);
        setTimeout(() => {
            notification.style.transform = 'translateX(450px) scale(0.9)';
            notification.style.opacity = '0';
        }, 3500);
    };

    // Logout handler (unchanged)
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    // Enhanced hover handlers
    const handleCardHover = (e, isEntering) => {
        const card = e.currentTarget;
        const glow = card.querySelector('.card-glow');
        
        if (isEntering) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = `${colors.shadowHover}, inset 0 1px 0 rgba(255, 255, 255, 0.9)`;
            if (glow) glow.style.opacity = '1';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = `${colors.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`;
            if (glow) glow.style.opacity = '0';
        }
    };

    // Enhanced CSS animations
    const keyframes = `
        @keyframes pulse {
            0%, 100% { 
                opacity: 1;
                transform: scale(1);
                box-shadow: 0 0 10px ${colors.success}40;
            }
            50% { 
                opacity: 0.7;
                transform: scale(1.1);
                box-shadow: 0 0 20px ${colors.success}60;
            }
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-80px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(80px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes expandWidth {
            from {
                width: 0;
            }
            to {
                width: 80px;
            }
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @media (max-width: 1200px) {
            .main-content {
                flex-direction: column !important;
                gap: 40px !important;
            }
            .left-card {
                min-width: auto !important;
            }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={styles.pageContainer}>
                <div style={styles.backgroundDecoration}></div>
                <div id="notification" style={styles.notification}></div>

                <div style={styles.contentWrapper}>
                    <div style={styles.header}>
                        <div>
                            <h1 style={styles.title}>Employee Self-Service Portal</h1>
                            <div style={styles.subtitle}>
                                <span style={styles.statusDot}></span>
                                Welcome back! Manage your tickets and requests efficiently.
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={styles.logoutButton}
                            onMouseEnter={e => Object.assign(e.currentTarget.style, styles.logoutButtonHover)}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.danger} 0%, #DC2626 100%)`;
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = `0 6px 20px rgba(231, 76, 60, 0.3)`;
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    <div style={styles.mainContent} className="main-content">
                        <div 
                            style={styles.leftCard}
                            className="left-card"
                            onMouseEnter={(e) => handleCardHover(e, true)}
                            onMouseLeave={(e) => handleCardHover(e, false)}
                        >
                            <div className="card-glow" style={styles.cardGlow}></div>
                            <h2 style={styles.cardHeader}>
                                Create New Ticket
                                <div style={styles.cardHeaderAccent}></div>
                            </h2>
                            <p style={styles.cardDescription}>
                                Use our intelligent system to quickly raise tickets or submit requests. 
                                Get instant assistance and automated routing for faster resolution.
                            </p>
                            <TicketForm onTicketCreated={handleTicketCreated} />
                        </div>

                        <div 
                            style={styles.rightCard}
                            onMouseEnter={(e) => handleCardHover(e, true)}
                            onMouseLeave={(e) => handleCardHover(e, false)}
                        >
                            <div className="card-glow" style={styles.cardGlow}></div>
                            <h2 style={styles.cardHeader}>
                                My Tickets Dashboard
                                <div style={styles.cardHeaderAccent}></div>
                            </h2>
                            <p style={styles.cardDescription}>
                                Track the status of your submitted tickets, view responses, and manage your requests 
                                all in one place. You can delete tickets that are no longer needed.
                            </p>
                            <TicketList tickets={tickets} onDeleteTicket={handleDeleteTicket} showDeleteOption={true} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeDashboard;