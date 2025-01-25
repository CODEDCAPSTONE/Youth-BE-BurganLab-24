const express = require("express");
const { body } = require("express-validator");
const Budget = require("../../model/budget");
const Card = require("../../model/card");

const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const validators = [
  // body("limit").not().isEmpty().withMessage("Limit is required"),
];

// POST route to create a new budget
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
      "Entertainment",
      "Other",
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

// POST route to edit budget
router.post(
  "/edit",
  requireAuth,
  validators,
  validateRequest,
  async (req, res) => {
    // const { category, limit } = req.body;
    try {
      // Adding the list of categories
      const categoriesEnum = [
        "Online shopping",
        "Restaurant",
        "Fuel",
        "Entertainment",
        "Other",
      ];
      for (let x in req.body) {
        await Budget.findOneAndUpdate({ category: x }, { limit: req.body[x] });
      }
      // const currentBudget = await Budget.findOne(req.body[categoriesEnum[0]]);

      res.status(201).json({
        message: "Successfull",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/edit",
  requireAuth,
  validators,
  validateRequest,
  async (req, res) => {
    // const { category, limit } = req.body;
    try {
      // Adding the list of categories
      const categoriesEnum = [
        "Online shopping",
        "Restaurant",
        "Fuel",
        "Entertainment",
        "Other",
      ];
      for (let x in req.body) {
        await Budget.findOneAndUpdate({ category: x }, { limit: req.body[x] });
      }
      // const currentBudget = await Budget.findOne(req.body[categoriesEnum[0]]);

      res.status(201).json({
        message: "Successfull",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = { budgetCreateRouter: router };
