const express = require("express");
const { body } = require("express-validator");
const User = require("../../model/user");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const transferValidators = [
  body("fromPhoneNumber")
    .notEmpty()
    .withMessage("Sender phone number is required"),
  body("toPhoneNumber")
    .notEmpty()
    .withMessage("Receiver phone number is required"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than zero"),
];

// POST route to transfer money by WAMD using phone numbers
router.post(
  "/transferByWAMD",
  requireAuth,
  transferValidators,
  validateRequest,
  async (req, res) => {
    const { fromPhoneNumber, toPhoneNumber, amount } = req.body;

    try {
      // Find the sender user by phone number
      const fromUser = await User.findOne({
        phoneNumber: fromPhoneNumber,
      }).populate("cards");

      if (!fromUser) {
        return res.status(404).json({ error: "Sender user not found" });
      }
      console.log(fromUser);

      if (fromUser.cards.length === 0) {
        return res
          .status(404)
          .json({ error: "Sender has no associated cards" });
      }

      // Find the receiver user by phone number
      const toUser = await User.findOne({
        phoneNumber: toPhoneNumber,
      }).populate("cards");

      if (!toUser) {
        return res.status(404).json({ error: "Receiver user not found" });
      }

      if (toUser.cards.length === 0) {
        return res
          .status(404)
          .json({ error: "Receiver has no associated cards" });
      }

      const fromCard = fromUser.cards[0]; // Assuming transfer from the first card
      const toCard = toUser.cards[0]; // Assuming transfer to the first card

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

module.exports = { transferByWAMDRouter: router };
