const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // <-- NEW: Import bcrypt

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'staff', 'admin'], default: 'employee' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

// NEW: Mongoose pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt (cost factor of 10)
        const salt = await bcrypt.genSalt(10);
        // Hash the password and replace the plain text version
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);