const express = require("express");
const { body } = require("express-validator");
const Budget = require("../../model/budget");
const Card = require("../../model/card");
const User = require("../../model/user");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

router.post(
  "/create",
  requireAuth,
  [
    body("onlineShopping").isNumeric(),
    body("dining").isNumeric(),
    body("fuel").isNumeric(),
    body("entertainment").isNumeric(),
  ],
  validateRequest,
  async (req, res) => {
    const { onlineShopping, dining, fuel, entertainment } = req.body;
    const userId = req.user.id;

    const budget = new Budget({
      onlineShopping,
      dining,
      fuel,
      entertainment,
      user: userId,
    });

    await budget.save();

    const user = await User.findById(userId);
    user.budgets = budget.id;
    await user.save();

    res.status(201).send(budget);
  }
);

router.put(
  "/edit/:id",
  requireAuth,
  [
    body("onlineShopping").isNumeric(),
    body("dining").isNumeric(),
    body("fuel").isNumeric(),
    body("entertainment").isNumeric(),
  ],
  validateRequest,
  async (req, res) => {
    const { onlineShopping, dining, fuel, entertainment } = req.body;
    const budgetId = req.params.id;

    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).send({ error: "Budget not found" });
    }

    budget.set({
      onlineShopping,
      dining,
      fuel,
      entertainment,
    });

    await budget.save();

    res.send(budget);
  }
);

router.get("/", requireAuth, async (req, res) => {
  const budgetId = req.params.id;

  const user = await User.findById(req.user.id).populate("budgets");
  const budget = user.budgets;

  if (!budget) {
    return res.status(404).send({ error: "Budget not found" });
  }

  res.send(budget);
});

module.exports = { budgetCreateRouter: router };
