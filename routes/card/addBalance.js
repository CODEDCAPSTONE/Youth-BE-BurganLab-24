const express = require("express");
const { body } = require("express-validator");
const { requireAuth, validateRequest } = require("../../middleware");
const { updateCardBalance } = require("./cardCreateRouter");
const User = require("../../model/user");
const Transaction = require("../../model/transaction");

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

      const user = await User.findById(req.user.id);
      if (!user) {
        throw new Error("User not found");
      }
      console.log("User found:", user);
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
      const updatedCard = await updateCardBalance(cardId, -amount);

      const transaction = new Transaction({
        name: "withdraw",
        amount,
        category: "withdraw",
        date: new Date().toISOString(),
        card: cardId,
      });
      await transaction.save();

      res.status(200).json(updatedCard);
    } catch (error) {
      console.error("Error deducting balance:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = { cardAdd: router };
