const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Team', TeamSchema);