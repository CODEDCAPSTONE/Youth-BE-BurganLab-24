// const express = require("express");
// const Card = require("../model/card");
// const User = require("../model/user");
// const Transaction = require("../model/transaction");
// const { requireAuth, validateRequest } = require("../middleware");

// const router = express.Router();

// // POST route to make a payment using the card
// router.post("/pay", requireAuth, validateRequest, async (req, res) => {
//   try {
//     const { name, cardNumber, amount, category } = req.body;

//     // Validate input
//     if (!cardNumber || !amount || amount <= 0) {
//       return res.status(400).json({ error: "Invalid cardNumber or amount." });
//     }

//     // Find the card using the cardNumber
//     const card = await Card.findOne({ cardNumber }).populate("user");
//     console.log(card);
//     if (!card) {
//       return res.status(404).json({ error: "Card not found." });
//     }

//     // Check if the amount exceeds the card's limit
//     // if (amount > card.limit) {
//     //   return res
//     //     .status(400)
//     //     .json({ error: "Transaction amount exceeds card limit." });
//     // }

//     // Check if the user's balance is sufficient
//     if (card.balance < amount) {
//       return res.status(400).json({ error: "Insufficient user balance." });
//     }

//     // Deduct the amount from the user's balance
//     card.balance -= amount;
//     await card.save();

//     // Create a new transaction
//     const transaction = await Transaction.create({
//       name,
//       card: card._id,
//       amount,
//       category,
//       date: new Date(),
//       user: card.user._id,
//     });

//     // Add the transaction to the user's transactions
//     const user = await User.findById(card.user._id);
//     user.transactions.push(transaction._id);
//     await user.save();

//     return res.status(200).json({
//       message: "Payment successful!",
//       transaction: {
//         cardNumber: card.cardNumber,
//         amount,
//         remainingBalance: card.balance,
//         category,
//       },
//     });
//   } catch (error) {
//     console.error("Error processing payment:", error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = { cardPaymentRouter: router };
const express = require("express");
const Card = require("../model/card");
const User = require("../model/user");
const Transaction = require("../model/transaction");
const Budget = require("../model/budget"); // Import the Budget model
const { requireAuth, validateRequest } = require("../middleware");

const router = express.Router();

// POST route to make a payment using the card
router.post("/pay", requireAuth, validateRequest, async (req, res) => {
  try {
    const { name, cardNumber, amount, category } = req.body;

    // Validate input
    if (!cardNumber || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid cardNumber or amount." });
    }

    // Find the card using the cardNumber
    const card = await Card.findOne({ cardNumber }).populate("user");
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    // Check if the user's balance is sufficient
    if (card.balance < amount) {
      return res.status(400).json({ error: "Insufficient user balance." });
    }

    // Deduct the amount from the user's balance
    card.balance -= amount;
    await card.save();

    // Create a new transaction
    const transaction = await Transaction.create({
      name,
      card: card._id,
      amount,
      category,
      date: new Date(),
      user: card.user._id,
    });

    // Add the transaction to the user's transactions
    const user = await User.findById(card.user._id);
    user.transactions.push(transaction._id);
    await user.save();

    // Update the budget for the corresponding category
    const budget = await Budget.findOne({ user: card.user._id });
    if (budget) {
      switch (category) {
        case "onlineShopping":
          budget.onlineShopping += amount;
          break;
        case "dining":
          budget.dining += amount;
          break;
        case "fuel":
          budget.fuel += amount;
          break;
        case "entertainment":
          budget.entertainment += amount;
          break;
        default:
          break;
      }
      await budget.save();
    }

    return res.status(200).json({
      message: "Payment successful!",
      transaction: {
        cardNumber: card.cardNumber,
        amount,
        remainingBalance: card.balance,
        category,
      },
    });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { cardPaymentRouter: router };
