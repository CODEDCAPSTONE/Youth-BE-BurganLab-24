const express = require("express");
const { body } = require("express-validator");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");
const User = require("../../model/user");

const router = express.Router();

const validators = [
  body("name").not().isEmpty().withMessage("name is required"),
];

// Function to generate Visa-like card number
function generateCardNumber() {
  const firstSix = "415254"; // Static first 6 digits
  let remainingTen = "";
  for (let i = 0; i < 10; i++) {
    remainingTen += Math.floor(Math.random() * 10); // Generate random digits
  }
  return firstSix + remainingTen;
}

// Function to generate a random 3-digit CVV
function generateCvv() {
  return Math.floor(100 + Math.random() * 900); // Random number between 100 and 999
}

// POST route to create a new card
router.post("/", requireAuth, validators, validateRequest, async (req, res) => {
  try {
    let cardNumber, cvv;

    // Ensure the cardNumber is unique
    do {
      cardNumber = generateCardNumber();
    } while (await Card.exists({ cardNumber }));

    // Ensure the CVV is unique
    do {
      cvv = generateCvv();
    } while (await Card.exists({ cvv }));

    // Add generated fields to the request body
    req.body.cardNumber = cardNumber;
    req.body.cvv = cvv;
    req.body.user = req.user.id;

    // Create and save the new card
    const newCard = await Card.create(req.body);
    let currentUser = await User.findById(req.user.id);
    currentUser.cards.push(newCard);
    currentUser.save();

    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { cardCreateRouter: router };
