const express = require("express");
const { body } = require("express-validator");
const { requireAuth, validateRequest } = require("../../middleware");
const {
  updateCardBalance,
  createNonDebitCardForUser,
} = require("./cardCreateRouter");
const User = require("../../model/user");
const Transaction = require("../../model/transaction");
const Target = require("../../model/target");

const router = express.Router();

const validators = [
  body("cardId").not().isEmpty().withMessage("cardId is required"),
  body("amount").isNumeric().withMessage("amount must be a number"),
];

router.post(
  "/add-balance",
  requireAuth,
  validators,
  validateRequest,
  async (req, res) => {
    try {
      const { cardId, amount } = req.body;

      const user = await User.findById(req.user.id).populate("targets");
      if (!user) {
        throw new Error("User not found");
      }
      // console.log("User found:", user);
      const category = amount === user.income ? "Salary" : "Transfer";

      const updatedCard = await updateCardBalance(cardId, amount);

      const transaction = new Transaction({
        name: "credited money",
        amount,
        category,
        date: new Date().toISOString(),
        card: cardId,
      });
      await transaction.save();

      user.transactions.push(transaction);

      if (category === "Salary") {
        // console.log("Processing salary deduction...");

        // console.log("user id", user.id);

        // const targets = await Target.find({ userId: user.id });
        const targets = user.targets;

        if (targets.length === 0) {
          await user.save();
          res.status(200).json(updatedCard);
          return;
        }

        // console.log("User targets 1:", targets);
        // console.log("User targets 2:", user.targets);

        const totalMonthlyDeduction = targets.reduce(
          (sum, target) => sum + target.monthlyDeduction,
          0
        );
        console.log("Total monthly deduction:", totalMonthlyDeduction);

        if (totalMonthlyDeduction > 0) {
          const updatedCardAfterDeduction = await updateCardBalance(
            cardId,
            -totalMonthlyDeduction
          );

          const targetTransaction = new Transaction({
            name: "target deduction",
            amount: totalMonthlyDeduction,
            category: "target",
            date: new Date().toISOString(),
            card: cardId,
          });
          await targetTransaction.save();

          user.transactions.push(targetTransaction);

          // Add monthlyDeduction amount to totalAmount for each target
          for (const target of targets) {
            target.totalAmount += target.monthlyDeduction;
            await target.save();
          }

          await user.save();

          res.status(200).json({ updatedCard, updatedCardAfterDeduction });
          return;
        }
      }

      await user.save();
      res.status(200).json(updatedCard);
    } catch (error) {
      console.error("Error adding balance:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/deduct-balance",
  requireAuth,
  validators,
  validateRequest,
  async (req, res) => {
    try {
      const { cardId, amount } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        throw new Error("User not found");
      }

      const updatedCard = await updateCardBalance(cardId, -amount);

      const transaction = new Transaction({
        name: "withdraw",
        amount,
        category: "withdraw",
        date: new Date().toISOString(),
        card: cardId,
      });
      await transaction.save();

      user.transactions.push(transaction);
      await user.save();

      res.status(200).json(updatedCard);
    } catch (error) {
      console.error("Error deducting balance:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/student", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cards");
    if (!user) {
      throw new Error("User not found");
    }

    if (user.student) {
      return res.status(400).json({ error: "Student benefit already used" });
    }

    if (user.cards.length === 0) {
      return res.status(400).json({ error: "No cards found for user" });
    }

    // Add 100 to the balance of the first card
    const firstCard = user.cards[0];
    const updatedFirstCard = await updateCardBalance(firstCard._id, 100);

    // Create a new non-debit card
    const newCard = await createNonDebitCardForUser(user._id);

    // Create a transaction for the reward
    const rewardTransaction = new Transaction({
      name: "student reward",
      amount: 100,
      category: "Reward",
      date: new Date().toISOString(),
      card: firstCard._id,
    });
    await rewardTransaction.save();

    // Update user student status
    user.student = true;
    user.cards.push(newCard);
    user.transactions.push(rewardTransaction);
    await user.save();

    res.status(200).json({ updatedFirstCard, newCard });
  } catch (error) {
    console.error("Error processing student request:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { cardAdd: router };
