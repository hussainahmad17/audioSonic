const express = require('express');
const { 
    GetAllCategories, 
    CreateCategory, 
    UpdateCategory, 
    DeleteCategory 
} = require('../controllers/categoryController');
const router = express.Router();

router.get("/", GetAllCategories);
router.post("/", CreateCategory);
router.put("/:id", UpdateCategory);  // Changed from "/update" to "/:id"
router.delete("/:id", DeleteCategory);

module.exports = router;