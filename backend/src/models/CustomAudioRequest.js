const mongoose = require('mongoose');

const customAudioRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomAudioRequest', customAudioRequestSchema);