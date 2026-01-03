const mongoose = require('mongoose');

const freeAudioDownloadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  audioId: { type: mongoose.Schema.Types.ObjectId, ref: 'FreeAudio' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FreeAudioDownload', freeAudioDownloadSchema);
