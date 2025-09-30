// server/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Required for hashing

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Set default role to 'admin'
    role: { type: String, enum: ['employee', 'staff', 'admin'], default: 'admin' }, 
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

// IMPORTANT: Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Manually specify the collection name as 'admin'
module.exports = mongoose.model('Admin', UserSchema, 'admin');