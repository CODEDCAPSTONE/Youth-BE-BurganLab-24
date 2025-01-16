const express = require("express");
const { body } = require("express-validator");
const Target = require("../model/target");
const { requireAuth, validateRequest } = require("../middleware");

const router = express.Router();

const validators = [
  body("targetName").not().isEmpty().withMessage("targetName is required"),
  body("balanceTarget")
    .not()
    .isEmpty()
    .withMessage("balanceTarget is required"),
  body("totalAmount").not().isEmpty().withMessage("totalAmount is required"),
  body("duration").not().isEmpty().withMessage("duration is required"),
  body("salary").not().isEmpty().withMessage("salary is required"),
];

// POST route to create a new target
router.post("/", validators, validateRequest, async (req, res) => {
  const { targetName, balanceTarget, totalAmount, duration, salary } = req.body;
  try {
    const newTarget = await Target.create(req.body);
    res.status(201).json(newTarget);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { targetCreateRouter: router };
