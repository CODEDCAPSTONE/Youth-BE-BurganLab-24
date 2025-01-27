const express = require("express");
const { body } = require("express-validator");
const Budget = require("../../model/budget");
const Card = require("../../model/card");
const User = require("../../model/user");
const Transaction = require("../../model/transaction"); // Add this line to import the Transaction model
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

    const existingBudget = await Budget.findOne({ user: userId });
    if (existingBudget) {
      return res.status(400).send({ error: "User already has a budget" });
    }

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
  "/edit",
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

    const budget = await Budget.findOne({ user: userId });

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
  console.log("calculating budget...");
  const userId = req.user.id;
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const user = await User.findById(userId).populate("budgets").populate({
    path: "transactions",
    // match: { date: { $gte: startOfMonth, $lte: endOfMonth } },
  });
  const budget = user.budgets;

  if (!budget) {
    return res.status(404).send({ error: "Budget not found" });
  }

  const transactions = await Transaction.find({
    user: userId,
    // date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  console.log("transactions...");
  console.log(transactions);

  const spent = {
    onlineShopping: 0,
    dining: 0,
    fuel: 0,
    entertainment: 0,
  };

  transactions.forEach((transaction) => {
    console.log(transaction);
    if (transaction.category === "onlineShopping") {
      spent.onlineShopping += transaction.amount;
    } else if (transaction.category === "dining") {
      spent.dining += transaction.amount;
    } else if (transaction.category === "fuel") {
      spent.fuel += transaction.amount;
    } else if (transaction.category === "entertainment") {
      spent.entertainment += transaction.amount;
    }
  });

  res.send({ budget, spent });
});

module.exports = { budgetCreateRouter: router };
