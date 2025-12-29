const  mongoose  = require('mongoose');
const SubCategory = require('../models/Sub-Category');

const getAllSubCategories = async (req, res) => {
    try {
        const allSubCategories = await SubCategory.find();
        res.status(200).json({ data: allSubCategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// GET subcategories for a specific category
const getSubCategoriesByCategoryId = async (req, res) => {
    try {
        const { id } = req.params; // Changed from categoryId to id
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid or missing categoryId" });
        }
        const subCategories = await SubCategory.find({ CategoryId: id })
        res.status(200).json({ data: subCategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST new subcategory
const addSubCategory = async (req, res) => {
    try {
        const { Name, CategoryId } = req.body;
        if (!Name || !CategoryId) return res.status(400).json({ message: "Name and CategoryId are required." });

        const newSub = await SubCategory.create({ Name, CategoryId });
        res.status(201).json({ data: newSub });
    } catch (error) {
        console.error("Error adding subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PUT update subcategory
const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, CategoryId } = req.body;

        const updated = await SubCategory.findByIdAndUpdate(id, { Name, CategoryId }, { new: true });
        if (!updated) return res.status(404).json({ message: "Sub-category not found" });

        res.status(200).json({ data: updated });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE subcategory
const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SubCategory.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Sub-category not found" });

        res.status(200).json({ message: "Sub-category deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAllSubCategories,
    getSubCategoriesByCategoryId,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
};
