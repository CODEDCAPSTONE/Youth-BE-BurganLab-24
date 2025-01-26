const express = require("express");
const User = require("../model/user");
const Card = require("../model/card");
const Transaction = require("../model/transaction");
const { requireAuth } = require("../middleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("transaction");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      transactions: user.transaction,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/card", requireAuth, async (req, res) => {
  const { cardNumber } = req.body;
  try {
    const card = await Card.findOne({ cardNumber });
    const list = await Transaction.find({card: card.id});

    res.status(200).json({
      list
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { transactionsRouter: router };
