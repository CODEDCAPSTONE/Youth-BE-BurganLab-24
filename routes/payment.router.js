const express = require("express");
const Card = require("../model/card");
const User = require("../model/user");
const Transaction = require("../model/transaction");
const { requireAuth, validateRequest } = require("../middleware");

const router = express.Router();

// POST route to make a payment using the card
router.post("/pay", requireAuth, validateRequest, async (req, res) => {
  try {
    const { cardNumber, amount, category } = req.body;

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
    if (card.balance < amount) {
      return res.status(400).json({ error: "Insufficient user balance." });
    }

    // Deduct the amount from the user's balance
    card.balance -= amount;
    await user.save();
    await card.save();
    return res.status(200).json({
      message: "Payment successful!",
      transaction: {
        cardNumber: card.cardNumber,
        amount,
        remainingBalance: card.balance,
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to make a payment using the card
router.post("/dummy", requireAuth, validateRequest, async (req, res) => {
  try {
    const { cardNumber } = req.body;
    // Validate input
    if (!cardNumber) {
      return res.status(400).json({ error: "Invalid cardNumber." });
    }

    const card = await Card.findOne({ cardNumber });
    
    const categories = [
      "Online shopping",
      "Restaurant",
      "Fuel",
      "Other",
      "Entertainment",
    ];
    
    const months = ["Jan", "Feb"];

    for (let i = 0; i < 20; i++) {
      await Transaction.create({
        name: "Dummy",
        amount: Math.floor(Math.random() * 20),
        category: categories[Math.floor(Math.random() * 5)],
        date: "Jan",
        card: card
      });
    }

    // // Deduct the amount from the user's balance
    // card.balance -= amount;
    // await user.save();
    // await card.save();
    // return res.status(200).json({
    //   message: "Payment successful!",
    //   transaction: {
    //     cardNumber: card.cardNumber,
    //     amount,
    //     remainingBalance: user.balance,
    //   },
    // });
    return res.status(200).json({
      message: "Done"
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to make a payment using the card
router.get("/dummy", requireAuth, validateRequest, async (req, res) => {
  try {
    const { cardNumber } = req.body;
    // Validate input
    if (!cardNumber) {
      return res.status(400).json({ error: "Invalid cardNumber." });
    }

    const card = await Card.findOne({ cardNumber });
    const transactions = await Transaction.find({ card });
    return res.status(200).json({
      transactions
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = { cardPaymentRouter: router };
