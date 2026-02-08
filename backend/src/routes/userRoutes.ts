import express from "express";
import User from "../models/User";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Error fetching users",
      });
  }
});

router.post("/login", async (req, res) => {
  const { phone, role, name } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        role,
        name: name || "New User",
        walletBalance: 0,
      });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : "Error logging in",
      });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : "Error fetching user",
      });
  }
});

export default router;
