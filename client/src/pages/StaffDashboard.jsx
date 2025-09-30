// client/src/pages/StaffDashboard.jsx
import React, { useState, useEffect } from 'react';
import StaffTicketList from '../components/StaffTicketList';
import { useNavigate } from 'react-router-dom';

function StaffDashboard() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedToday: 0
    });
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tickets and calculate stats
    useEffect(() => {
        fetchTicketsAndCalculateStats();
    }, []);

    const fetchTicketsAndCalculateStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/tickets', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const ticketData = await response.json();
                setTickets(ticketData);

                const today = new Date().toDateString();

                const calculatedStats = {
                    totalTickets: ticketData.length,
                    openTickets: ticketData.filter(ticket => ticket.status === 'open').length,
                    inProgressTickets: ticketData.filter(ticket => ticket.status === 'in-progress').length,
                    resolvedToday: ticketData.filter(ticket => {
                        return ticket.status === 'resolved' &&
                               new Date(ticket.updatedAt).toDateString() === today;
                    }).length
                };

                setStats(calculatedStats);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setStats({
                totalTickets: 0,
                openTickets: 0,
                inProgressTickets: 0,
                resolvedToday: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const colors = {
        primary: '#1E3A8A',
        primaryLight: '#3B82F6',
        secondary: '#64748B',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        cardBg: '#FFFFFF',
        textMuted: '#6B7280',
        border: '#E5E7EB',
        shadow: '0 10px 25px rgba(0,0,0,0.15)',
        shadowHover: '0 15px 35px rgba(0,0,0,0.2)',
        gradientCard: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
    };

    const styles = {
        pageContainer: { background: '#f0f2f5', minHeight: '100vh', padding: '40px 30px' },
        header: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', padding: '25px 35px', backgroundColor: colors.cardBg, borderRadius: '16px', boxShadow: colors.shadow, border: `1px solid ${colors.border}` },
        titleSection: { display: 'flex', alignItems: 'center', gap: '20px' },
        roleIndicator: { padding: '8px 16px', backgroundColor: colors.primary, color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' },
        title: { color: colors.primary, margin: '0', fontSize: '32px', fontWeight: '800' },
        subtitle: { color: colors.textMuted, fontSize: '16px', marginTop: '8px' },
        headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
        currentTime: { fontFamily: 'monospace', fontWeight: '700' },
        currentDate: { color: colors.textMuted, fontSize: '14px', marginTop: '2px' },
        logoutButton: { padding: '12px 24px', background: colors.danger, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
        statsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' },
        statCard: { background: colors.gradientCard, padding: '25px 30px', borderRadius: '16px', boxShadow: colors.shadow, border: `1px solid ${colors.border}`, transition: 'all 0.3s', cursor: 'pointer' },
        statIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '15px' },
        statNumber: { fontSize: '32px', fontWeight: '800', margin: '0' },
        statLabel: { fontSize: '14px', color: colors.textMuted, fontWeight: '600', marginTop: '8px' },
        mainContent: { backgroundColor: colors.cardBg, borderRadius: '16px', boxShadow: colors.shadow, border: `1px solid ${colors.border}`, overflow: 'hidden' },
        contentHeader: { padding: '30px 35px 20px', borderBottom: `2px solid ${colors.border}` },
        contentTitle: { color: colors.primary, fontSize: '24px', fontWeight: '700', margin: '0 0 10px 0' },
        contentDescription: { color: colors.textMuted, fontSize: '16px', lineHeight: '1.6', margin: '0' },
        ticketListContainer: { padding: '35px' },
        quickActions: { display: 'flex', gap: '15px', marginBottom: '40px' },
        actionButton: { padding: '12px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
    };

    const formatTime = (date) => date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
    const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const dynamicStats = [
        { number: loading ? '...' : stats.totalTickets.toString(), label: 'All Tickets', color: colors.primary, bgColor: `${colors.primary}15` },
        { number: loading ? '...' : stats.openTickets.toString(), label: 'Open Tickets', color: colors.warning, bgColor: `${colors.warning}15` },
        { number: loading ? '...' : stats.inProgressTickets.toString(), label: 'In Progress', color: colors.primaryLight, bgColor: `${colors.primaryLight}15` },
        { number: loading ? '...' : stats.resolvedToday.toString(), label: 'Completed Today', color: colors.success, bgColor: `${colors.success}15` }
    ];

    const handleCardHover = (e, isEntering) => {
        const card = e.currentTarget;
        card.style.transform = isEntering ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)';
        card.style.boxShadow = isEntering ? colors.shadowHover : colors.shadow;
    };

    return (
        <div style={styles.pageContainer}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <div style={styles.roleIndicator}>IT Staff</div>
                    <div>
                        <h1 style={styles.title}>Management Dashboard</h1>
                        <p style={styles.subtitle}>Monitor, assign, and resolve support tickets efficiently</p>
                    </div>
                </div>

                <div style={styles.headerRight}>
                    <div>
                        <div style={styles.currentTime}>{formatTime(currentTime)}</div>
                        <div style={styles.currentDate}>{formatDate(currentTime)}</div>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={styles.statsContainer}>
                {dynamicStats.map((stat, idx) => (
                    <div
                        key={idx}
                        style={styles.statCard}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <div style={{ ...styles.statIcon, backgroundColor: stat.bgColor, color: stat.color }}>
                            {stat.label.split(' ')[0].substring(0, 3)}
                        </div>
                        <h3 style={{ ...styles.statNumber, color: stat.color }}>{stat.number}</h3>
                        <p style={styles.statLabel}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActions}>
                <button style={{ ...styles.actionButton, backgroundColor: colors.primary, color: 'white' }} onClick={fetchTicketsAndCalculateStats}>Refresh Stats</button>
            </div>

            {/* Ticket List */}
            <div style={styles.mainContent}>
                <div style={styles.contentHeader}>
                    <h2 style={styles.contentTitle}>Active Ticket Management</h2>
                    <p style={styles.contentDescription}>View all open and in-progress tickets. Update statuses, assign agents, and track resolution progress in real-time.</p>
                </div>
                <div style={styles.ticketListContainer}>
                    <StaffTicketList isReadOnly={false} onTicketUpdate={fetchTicketsAndCalculateStats} />
                </div>
            </div>
        </div>
    );
}

export default StaffDashboard;
