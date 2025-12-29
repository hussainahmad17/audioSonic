const express = require('express');
const {
    getSubCategoriesByCategoryId,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getAllSubCategories
} = require('../controllers/subCategories');

const router = express.Router();

// Get subcategories for a specific category
router.get("/category/:id", getSubCategoriesByCategoryId);

router.get("/", getAllSubCategories);

// Add subcategory
router.post("/", addSubCategory);

// Update subcategory
router.put("/:id", updateSubCategory);

// Delete subcategory
router.delete("/:id", deleteSubCategory);

module.exports = router;

