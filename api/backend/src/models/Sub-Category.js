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
  timestamps: true,
});

SubCategorySchema.index({ Name: 1, CategoryId: 1 }, { unique: true });

module.exports = model("SubCategory", SubCategorySchema);
