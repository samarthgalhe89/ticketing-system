// server/routes/tickets.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User'); 
const Team = require('../models/Team');
const KBArticle = require('../models/KBArticle'); 
const axios = require('axios');
const auth = require('../middleware/auth'); 
const sendNotification = require('../utils/emailServices'); // <-- FIXED FILENAME: emailService (singular)

// @route    POST /api/tickets
// @desc     Create a new ticket with AI classification & KB lookup
// @access   Private
router.post('/', auth, async (req, res) => { 
    try {
        const createdBy = req.user.id; 
        const { title, description, urgency } = req.body;
        
        // --- Day 2 Logic: Step 1. Check for a Knowledge Base match ---
        const kbMatch = await KBArticle.findOne({
            title: new RegExp(title, 'i') 
        });

        if (kbMatch) {
            // KB MATCH: Return the solution and STOP the function
            return res.json({
                message: "Solution found! Ticket auto-resolved.",
                kbSolution: kbMatch.content,
                status: "Resolved"
            });
        }

        // --- Day 2 Logic: Step 2. Call the AI classifier ---
        const aiResponse = await axios.post('http://127.0.0.1:8000/classify', {
            text: description 
        }, {
            timeout: 30000 
        });
        
        const category = aiResponse.data.category;

        // --- Day 2 Logic: Step 3. Create and save the new ticket ---
        const newTicket = new Ticket({
            title, description, urgency, createdBy, category
        });
        const ticket = await newTicket.save();
        
        // --- NOTIFICATION: Ticket Creation ---  <-- ADDED HERE
        const employee = await User.findById(createdBy); // Fetch employee details
        if (employee) {
            const subject = `[Ticket #${ticket._id.toString().slice(-4)}] New Ticket Logged: ${ticket.title}`;
            const text = `Dear ${employee.name},\n\nYour ticket has been logged successfully.\n\nTicket ID: ${ticket._id}\nCategory: ${ticket.category}\nStatus: Open\n\nWe will get back to you shortly.\n\nPOWERGRID IT Support`;
            
            // Send the email (null for HTML body in this prototype)
            await sendNotification(employee.email, subject, text, null);
        }
        // --- END NOTIFICATION ---

        res.status(201).json(ticket); // Send success response

    } catch (err) {
        console.error("Ticket Submission Error:", err);
        res.status(500).json({ msg: "Server Error creating ticket. Check AI service logs.", error: err.message });
    }
});

// @route    GET /api/tickets
// @desc     Get all tickets 
// @access   Private (Protected by auth middleware)
router.get('/', auth, async (req, res) => { 
    try {
        // ... (existing GET logic)
        const tickets = await Ticket.find()
            .populate('createdBy', 'name email')
            .populate('team', 'name')
            .sort({ createdAt: -1 }); 

        res.json(tickets);
    } catch (err) {
        console.error("Ticket Fetch Error:", err);
        res.status(500).json({ msg: "Server Error fetching tickets", error: err.message });
    }
});

module.exports = router;