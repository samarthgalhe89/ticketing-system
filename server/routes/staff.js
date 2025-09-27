// server/routes/staff.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User'); // <-- NEW: Required to fetch user details for email
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const sendNotification = require('../utils/emailServices'); // <-- NEW: Email Utility

// @route    GET /api/staff/tickets
// @desc     Get ALL open tickets for Staff/Admin view
// @access   Private (Staff, Admin)
router.get('/tickets', auth, roleAuth(['staff', 'admin']), async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: { $ne: 'Closed' } }) 
            .populate('createdBy', 'name email')
            .sort({ urgency: -1, createdAt: 1 });
            
        res.json(tickets);
    } catch (err) {
        console.error('Staff fetch error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT /api/staff/tickets/:id
// @desc     Update ticket status (e.g., In Progress -> Resolved)
// @access   Private (Staff, Admin)
router.put('/tickets/:id', auth, roleAuth(['staff', 'admin']), async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const ticketId = req.params.id;
        
        // 1. Ensure only allowed fields are updated
        const updateFields = {};
        if (status) updateFields.status = status;
        if (assignedTo) updateFields.assignedTo = assignedTo;

        const ticket = await Ticket.findByIdAndUpdate(
            ticketId,
            { $set: updateFields, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }
        
        // --- NOTIFICATION: Status Update (New Logic Added Here) ---
        // 2. Check if the status was set to Resolved or Closed
        if (status === 'Resolved' || status === 'Closed') {
            // Populate the ticket to get the creator's email before sending notification
            await ticket.populate('createdBy', 'name email');
            
            const subject = `[Ticket #${ticket._id.toString().slice(-4)}] Status Updated to: ${status}`;
            const text = `Dear ${ticket.createdBy.name},\n\nYour ticket status has been updated to ${status}.\n\nTitle: ${ticket.title}\n\nThank you.\n\nPOWERGRID IT Support`;
            
            // Send the email notification
            await sendNotification(ticket.createdBy.email, subject, text, null);
        }
        // --- END NOTIFICATION ---

        res.json(ticket); // 3. Send the final response
    } catch (err) {
        console.error('Staff update error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;