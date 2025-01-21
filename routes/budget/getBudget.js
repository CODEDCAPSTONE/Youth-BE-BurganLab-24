const express = require("express");

const Budget = require("../../model/budget");
const { requireAuth } = require("../../middleware");
const router = express.Router();

// GET route to fetch all budgets
router.get("/", requireAuth, async (req, res) => {
  try {
    const budgets = await Budget.find().populate("user");

    // Adding the list of categories
    const categoriesEnum = [
      "Online shopping",
      "Restaurant",
      "Fuel",
      "Other",
      "Entertainment",
    ];

    res.status(200).json({
      budgets,
      categories: categoriesEnum,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});
module.exports = { budgetGetRouter: router };
