import express from "express";
import SubCategory from "../models/SubCategory";

const router = express.Router();

// Get all subcategories
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error fetching subcategories",
    });
  }
});

// Update subcategory
router.patch("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error updating subcategory",
    });
  }
});

// Create subcategory
router.post("/", async (req, res) => {
  try {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error creating subcategory",
    });
  }
});

export default router;
