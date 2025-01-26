const express = require("express");

const jwt = require("jsonwebtoken");

const { body } = require("express-validator");

const User = require("../model/user");

const validateRequest = require("../middleware/validateRequest");
const { BadRequestError } = require("../errors");

const router = express.Router();

const validators = [
  body("username").not().isEmpty().withMessage("Username is required"),
  body("phoneNumber")
    .trim()
    .isLength({ max: 8 })
    .withMessage("phoneNumber must be 8 number"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("email").not().isEmpty().withMessage("Email is required"),
];

router.post("/signup", validators, validateRequest, async (req, res, next) => {
  const { username, password, email, phoneNumber } = req.body;
  console.log("here");

  // Check for existing user
  const existingUser = await User.findOne({ username });

  if (existingUser) return next(BadRequestError("Username is taken"));

  // Create a user
  const user = await User.create({ username, password, email, phoneNumber });
  console.log(jwt);

  // Generate a token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION_MS },
    { balance: 1000 }
  );

  // Respond with the token
  res.status(201).json({ token });
});

module.exports = { signupRouter: router };
