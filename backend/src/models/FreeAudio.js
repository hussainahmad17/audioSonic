const mongoose = require('mongoose');

const freeAudiosSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId, // Change to ObjectId
    ref: 'Category', // Reference to Category model
    required: true,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  },
  language: {
    type: String,
    required: true,
  },
  voice: {
    type: String,
    required: true,
  },
  audioFile: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const FreeAudio = mongoose.model('FreeAudio', freeAudiosSchema);
module.exports = FreeAudio;
