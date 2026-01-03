const mongoose = require('mongoose');
const FreeAudio = require('./FreeAudio');

const paidAudiosSchema = new mongoose.Schema({
  ...FreeAudio.schema.obj,
  priceAmount: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const PaidAudio = mongoose.model("PaidAudio", paidAudiosSchema);
module.exports = PaidAudio;
