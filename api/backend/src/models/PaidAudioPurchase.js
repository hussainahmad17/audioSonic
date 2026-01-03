const mongoose = require('mongoose');

const paidAudioPurchaseSchema = new mongoose.Schema({
  email: { type: String },
  audioId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaidAudio' },
  amount: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaidAudioPurchase', paidAudioPurchaseSchema);
