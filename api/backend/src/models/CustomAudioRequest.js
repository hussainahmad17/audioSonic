const mongoose = require('mongoose');

const customAudioRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number },
  deadline: { type: Date },
  status: { type: String, default: 'pending' },
  amountPaid: { type: Number, default: 0 },
  requestDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomAudioRequest', customAudioRequestSchema);
