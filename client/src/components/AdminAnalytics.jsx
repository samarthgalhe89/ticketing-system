// client/src/components/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// IMPORTANT: Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminAnalytics() {
    const [stats, setStats] = useState({ categories: [], counts: [], openVsClosed: { open: 0, resolved: 0 } });
    const [loading, setLoading] = useState(true);
    const primaryColor = '#4A6572';

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // We reuse the /api/staff/tickets GET route and process the data locally
            const res = await axios.get('http://localhost:3030/api/staff/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // --- Data Processing for Charts ---
            const data = res.data;
            const categoryMap = {};
            let open = 0;
            let resolved = 0;

            data.forEach(ticket => {
                const category = ticket.category || 'Unclassified';
                categoryMap[category] = (categoryMap[category] || 0) + 1;
                
                if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
                    resolved++;
                } else {
                    open++;
                }
            });

            setStats({
                categories: Object.keys(categoryMap),
                counts: Object.values(categoryMap),
                openVsClosed: { open, resolved }
            });
            setLoading(false);
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <p style={{ color: primaryColor }}>Loading System Analytics...</p>;

    // --- Chart Data Structure ---

    // 1. Tickets by Category Chart
    const categoryData = {
        labels: stats.categories,
        datasets: [{
            label: 'Tickets by Category',
            data: stats.counts,
            // Muted, professional color palette for bars
            backgroundColor: ['#6A99A8', '#4A6572', '#C4D3DD', '#A86A7A', '#724A5A', '#A8C4D3'] 
        }]
    };

    // 2. Open vs. Resolved Status Chart
    const statusData = {
        labels: ['Open / In Progress', 'Resolved / Closed'],
        datasets: [{
            label: 'Status Distribution',
            data: [stats.openVsClosed.open, stats.openVsClosed.resolved],
            backgroundColor: ['#EF5350', '#4CAF50'] // Muted Red (Open) vs Muted Green (Resolved)
        }]
    };

    // --- Component Render ---
    return (
        <div>
            <h3 style={{ color: primaryColor, borderBottom: '1px solid #EAEFF2', paddingBottom: '10px' }}>
                System Analytics Overview
            </h3>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                
                {/* Chart 1: Category Distribution */}
                <div style={{ width: '45%', minWidth: '350px' }}>
                    <h4 style={{ color: primaryColor }}>Top Ticket Categories (AI Classification)</h4>
                    <Bar 
                        options={{ responsive: true, plugins: { legend: { display: false } } }} 
                        data={categoryData} 
                    />
                </div>
                
                {/* Chart 2: Status Distribution */}
                <div style={{ width: '45%', minWidth: '350px' }}>
                    <h4 style={{ color: primaryColor }}>Total Open vs. Resolved Status</h4>
                    <Bar 
                        options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} 
                        data={statusData} 
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminAnalytics;