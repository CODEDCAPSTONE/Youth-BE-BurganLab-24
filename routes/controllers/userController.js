const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const requireAuth = require("../../middleware/requireAuth");

router.post("/income", requireAuth, async (req, res) => {
  try {
    const { income } = req.body;

    if (income === undefined) {
      return res.status(400).json({
        success: false,
        message: " income is required",
      });
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.income = income;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/income", requireAuth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      income: user.income,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = {
  updateIncome: router,
  getIncome: router,
};
