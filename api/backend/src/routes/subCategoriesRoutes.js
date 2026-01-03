const express = require('express');
const { getSubCategoriesByCategoryId, addSubCategory, updateSubCategory, deleteSubCategory, getAllSubCategories } = require('../controllers/subCategories');

const router = express.Router();

router.get('/category/:id', getSubCategoriesByCategoryId);
router.get('/', getAllSubCategories);
router.post('/', addSubCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;
