const express = require("express");
const router = express.Router();
const Target = require("../../model/target"); // Import the Target model
const validateDuration = require("../../middleware/durationValidator"); // Validate duration

const User = require("../../model/user"); // Import the User model
const { requireAuth } = require("../../middleware");

// Route to create a new target
router.post("/", async (req, res) => {
  requireAuth;
  const { targetName, totalAmount, balanceTarget, income, duration, userId } =
    req.body;

  // Validate input fields
  if (
    !targetName ||
    !balanceTarget ||
    !duration ||
    !validateDuration(duration)
  ) {
    return res.status(400).json({
      message:
        "All fields are required, and duration must be a positive integer up to 12 months",
    });
  }

  try {
    // Check if the targetName already exists for the user
    const existingTarget = await Target.findOne({ targetName, user: userId });
    if (existingTarget) {
      return res.status(400).json({ message: "Target name must be unique" });
    }

    // Calculate monthly savings goal

    const monthlyDeduction = balanceTarget / duration;

    // Create the target
    const newTarget = new Target({
      targetName,
      totalAmount,
      balanceTarget,

      duration,
      monthlyDeduction: monthlyDeduction,
      user: userId,
    });

    // Save the target to the database
    await newTarget.save();

    // Add the target to the user's targets array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.targets.push(newTarget);
    await user.save();

    // Respond with the created target and calculated fields
    res.status(201).json({
      ...newTarget._doc,
      monthlyDeduction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { targetCreateRouter: router };
