const express = require('express');
const Category = require('../models/Category');

const GetAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const CreateCategory = async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ success: false, message: "Category name is required" });
    }

    try {
        const newCategory = new Category({ categoryName });
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

const UpdateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ success: false, message: "Category name is required" });
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id, 
            { categoryName }, 
            { new: true, runValidators: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

const DeleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    GetAllCategories,
    CreateCategory,
    UpdateCategory,
    DeleteCategory
}