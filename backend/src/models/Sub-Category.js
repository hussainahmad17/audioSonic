const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SubCategorySchema = new Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  CategoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }
}, {
  timestamps: true
});

// Prevent duplicate subcategory names under the same category
SubCategorySchema.index({ Name: 1, CategoryId: 1 }, { unique: true });

const SubCategory = model("SubCategory", SubCategorySchema);

module.exports = SubCategory;
