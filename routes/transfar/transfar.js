const express = require("express");
const { body } = require("express-validator");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const transferValidators = [
  body("fromCardNumber")
    .notEmpty()
    .withMessage("Sender card number is required"),
  body("toCardNumber")
    .notEmpty()
    .withMessage("Receiver card number is required"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than zero"),
];

// POST route to transfer money from one card to another using card numbers
router.post(
  "/",
  requireAuth,
  transferValidators,
  validateRequest,
  async (req, res) => {
    const { fromCardNumber, toCardNumber, amount } = req.body;

    try {
      // Find the sender's card by card number
      const fromCard = await Card.findOne({ cardNumber: fromCardNumber });
      if (!fromCard) {
        return res.status(404).json({ error: "Sender card not found" });
      }

      // Find the receiver's card by card number
      const toCard = await Card.findOne({ cardNumber: toCardNumber });
      if (!toCard) {
        return res.status(404).json({ error: "Receiver card not found" });
      }

      // Check if the sender has enough balance
      if (fromCard.balance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Perform the transfer
      fromCard.balance -= amount;
      toCard.balance += amount;

      // Save the updated cards
      await fromCard.save();
      await toCard.save();

      res.status(200).json({
        message: "Transfer successful",
        fromCard: {
          id: fromCard._id,
          balance: fromCard.balance,
        },
        toCard: {
          id: toCard._id,
          balance: toCard.balance,
        },
      });
    } catch (error) {
      console.error("Transfer error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = { transferRouter: router };
