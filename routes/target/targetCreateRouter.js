const express = require("express");
const router = express.Router();
const Target = require("../../model/target"); // Import the Target model
const validateDuration = require("../../middleware/durationValidator"); // Validate duration

// Route to create a new target
router.post("/", async (req, res) => {
  const { targetName, totalAmount, balanceTarget, income, duration, userId } =
    req.body;

  // Validate input fields
  if (
    !targetName ||
    !totalAmount ||
    !balanceTarget ||
    !income ||
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
    const monthlySavingsGoal = (totalAmount - balanceTarget) / duration;

    // Create the target
    const newTarget = new Target({
      targetName,
      totalAmount,
      balanceTarget,
      income,
      duration,
      user: userId,
    });

    // Save the target to the database
    await newTarget.save();

    // Respond with the created target and calculated fields
    res.status(201).json({
      ...newTarget._doc,
      monthlySavingsGoal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { targetCreateRouter: router };
