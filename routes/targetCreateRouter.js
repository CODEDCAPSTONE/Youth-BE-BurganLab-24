// const express = require("express");
// const { body } = require("express-validator");
// const Target = require("../model/target");
// const { requireAuth, validateRequest } = require("../middleware");

// const router = express.Router();

// const validators = [
//   body("targetName").not().isEmpty().withMessage("targetName is required"),
//   body("balanceTarget")
//     .not()
//     .isEmpty()
//     .withMessage("balanceTarget is required"),
//   body("totalAmount").not().isEmpty().withMessage("totalAmount is required"),
//   body("duration").not().isEmpty().withMessage("duration is required"),
//   body("income").not().isEmpty().withMessage("income is required"),
// ];

// // POST route to create a new target
// router.post("/", validators, validateRequest, async (req, res) => {
//   const { targetName, balanceTarget, totalAmount, duration, income } = req.body;
//   try {
//     const newTarget = await Target.create(req.body);
//     res.status(201).json(newTarget);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = { targetCreateRouter: router };
// targetController.js

const express = require("express");
const router = express.Router();
const validateDuration = require("../middleware/durationValidator");
const { validateRequest } = require("../middleware");

// Route to create a target
router.post("/", validateRequest, (req, res) => {
  const { targetName, totalAmount, balanceTarget, salary, duration } = req.body;

  // Validate input fields
  if (
    !targetName ||
    !totalAmount ||
    !balanceTarget ||
    !salary ||
    !validateDuration(duration)
  ) {
    return res.status(400).json({
      message:
        "All fields are required and duration must be a positive integer up to 12 months",
    });
  }

  // Calculate additional fields if needed, e.g., monthly savings goal
  const monthlySavingsGoal = (totalAmount - balanceTarget) / duration;

  // Create a new target object
  const newTarget = {
    targetName,
    totalAmount,
    balanceTarget,
    salary,
    duration,
    monthlySavingsGoal,
  };

  // Respond with the created target
  res.status(201).json(newTarget);
});

module.exports = { targetCreateRouter: router };
