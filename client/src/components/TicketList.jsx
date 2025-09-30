// client/src/components/TicketList.jsx
import React, { useState } from 'react';

function TicketList({ tickets, onDeleteTicket, showDeleteOption = false }) {
    const [deletingTicket, setDeletingTicket] = useState(null);

    const handleDeleteClick = async (ticketId, e) => {
        e.stopPropagation();
        setDeletingTicket(ticketId);

        if (onDeleteTicket) {
            await onDeleteTicket(ticketId); // call parent function
        }

        setDeletingTicket(null);
    };

    if (!tickets || tickets.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                No tickets submitted yet.
            </div>
        );
    }

    return (
        <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
            {tickets.map(ticket => (
                <div key={ticket._id} style={{
                    border: '1px solid #E5E9EC',
                    padding: '15px 20px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    backgroundColor: '#F7F9FB',
                    position: 'relative'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', paddingRight: showDeleteOption ? '80px' : '0' }}>
                        {ticket.title}
                        <span style={{ float: 'right', fontWeight: 'normal', color: '#888', fontSize: '12px' }}>
                            #{ticket._id.slice(-6)}
                        </span>
                    </h4>
                    <p>{ticket.description}</p>

                    {showDeleteOption && (
                        <button
                            onClick={(e) => handleDeleteClick(ticket._id, e)}
                            disabled={deletingTicket === ticket._id}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                backgroundColor: '#E74C3C',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {deletingTicket === ticket._id ? '...' : 'Delete'}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default TicketList;
