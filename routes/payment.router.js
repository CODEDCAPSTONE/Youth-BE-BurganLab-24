const express = require("express");
const Card = require("../model/card");
const User = require("../model/user");
const { requireAuth, validateRequest } = require("../middleware");

const router = express.Router();

// POST route to make a payment using the card
router.post("/pay", requireAuth, validateRequest, async (req, res) => {
  try {
    const { cardNumber, amount } = req.body;

    // Validate input
    if (!cardNumber || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid cardNumber or amount." });
    }

    // Find the card using the cardNumber
    const card = await Card.findOne({ cardNumber }).populate("user");
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    // Verify that the user owns this card
    const user = card.user;
    if (!user) {
      return res
        .status(404)
        .json({ error: "User associated with this card not found." });
    }

    // Check if the amount exceeds the card's limit
    if (amount > card.limit) {
      return res
        .status(400)
        .json({ error: "Transaction amount exceeds card limit." });
    }

    // Check if the user's balance is sufficient
    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient user balance." });
    }
    if (card.isExpired !== false) {
      return res.status(400).json({ error: "Card is expired." });
    }

    // Deduct the amount from the user's balance
    user.balance -= amount;
    card.isExpired = true;
    await user.save();
    await card.save();
    return res.status(200).json({
      message: "Payment successful!",
      transaction: {
        cardNumber: card.cardNumber,
        amount,
        remainingBalance: user.balance,
        isExisExpired: true,
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { cardPaymentRouter: router };
