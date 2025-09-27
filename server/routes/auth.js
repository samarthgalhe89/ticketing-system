// server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // <-- Now using your actual model

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        let user = await User.findOne({ email });

        if (!user) {
            // User not found
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Passwords don't match
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. If valid, create and return the JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role // We need the role for Day 4's access control
            }
        };

        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Send the token and the user's role back to the frontend
        return res.json({ token, role: user.role });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login');
    }
});

module.exports = router;