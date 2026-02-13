import express from "express";
import Category from "../models/Category";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error fetching categories",
    });
  }
});

// Update a category
router.patch("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error updating category",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error creating category",
    });
  }
});

export default router;
