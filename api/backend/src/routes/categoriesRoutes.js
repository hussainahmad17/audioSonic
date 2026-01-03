const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post('/', async (req, res) => {
  const cat = await Category.create({ categoryName: req.body.categoryName });
  res.json(cat);
});

module.exports = router;
