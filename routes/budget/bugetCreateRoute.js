const express = require("express");
const { body } = require("express-validator");
const Budget = require("../../model/budget");
const Card = require("../../model/card");

const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const validators = [
  body("limit").not().isEmpty().withMessage("Limit is required"),
];

// POST route to create a new target
router.post("/", requireAuth, validators, validateRequest, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const newBudget = await Budget.create(req.body);
    const populatedBudget = await newBudget.populate("user");

    // Adding the list of categories
    const categoriesEnum = [
      "Online shopping",
      "Restaurant",
      "Fuel",
      "Other",
      "Entertainment",
    ];

    res.status(201).json({
      budget: populatedBudget,
      categories: categoriesEnum,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { budgetCreateRouter: router };
