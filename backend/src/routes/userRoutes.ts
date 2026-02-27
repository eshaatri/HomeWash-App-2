import express from "express";
import User from "../models/User";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error fetching users",
    });
  }
});

router.post("/login", async (req, res) => {
  const { phone, role, name, partnerId } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      const payload: any = {
        phone,
        role,
        name: name || "New User",
        walletBalance: 0,
      };
      if (partnerId) {
        payload.partnerId = partnerId;
      }
      user = await User.create(payload);
    } else if (partnerId && role === "PROFESSIONAL" && !user.partnerId) {
      user.partnerId = partnerId;
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error fetching user",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error updating user",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error deleting user",
    });
  }
});

export default router;
