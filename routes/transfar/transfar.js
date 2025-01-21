const express = require("express");
const { body } = require("express-validator");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const transferValidators = [
  body("fromCardId").not().isEmpty().withMessage("Sender card ID is required"),
  body("toCardId").not().isEmpty().withMessage("Receiver card ID is required"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
];

// POST route to transfer money from one card to another
router.post(
  "/",
  requireAuth,
  transferValidators,
  validateRequest,
  async (req, res) => {
    const { fromCardId, toCardId, amount } = req.body;

    try {
      // Find the sender's card
      const fromCard = await Card.findByIdAndUpdate(fromCardId);
      if (!fromCard) {
        return res.status(404).json({ error: "Sender card not found" });
      }

      // Find the receiver's card
      const toCard = await Card.findByIdAndUpdate(toCardId);
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
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = { transfarRouter: router };
