const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
