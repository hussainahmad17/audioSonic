const mongoose = require('mongoose');

const paidAudioPurchaseSchema = new mongoose.Schema({
  email: { type: String, required: true },
  audioId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaidAudio', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaidAudioPurchase', paidAudioPurchaseSchema);