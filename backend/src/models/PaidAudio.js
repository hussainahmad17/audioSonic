// models/PaidAudio.js
const mongoose = require('mongoose');
const FreeAudio = require('./FreeAudio'); // Base schema

const paidAudiosSchema = new mongoose.Schema({
  ...FreeAudio.schema.obj, // Inherit all fields from FreeAudio
  priceAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
});


const PaidAudio = mongoose.model("PaidAudio", paidAudiosSchema);
module.exports = PaidAudio;

