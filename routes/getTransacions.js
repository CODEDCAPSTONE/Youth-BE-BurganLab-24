const express = require("express");
const User = require("../model/user");
const { requireAuth } = require("../middleware");

const router = express.Router();

router.get("/transaction", requireAuth, async (req, res) => {
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

module.exports = { transactionsRouter: router };
