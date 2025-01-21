const express = require("express");
const { body } = require("express-validator");
const Budget = require("../../model/budget");
const Card = require("../../model/card");

const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const validators = [
  body("category").not().isEmpty().withMessage("Category is required"),
  body("limit").not().isEmpty().withMessage("Limit is required"),
];

// POST route to create a new target
router.post("/", requireAuth, validators, validateRequest, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const newBudget = await Budget.create(req.body);
    res.status(201).json(await newBudget.populate("user"));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { budgetCreateRouter: router };
