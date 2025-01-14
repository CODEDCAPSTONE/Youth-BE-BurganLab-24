// const express = require("express");
// const jwt = require("jsonwebtoken");
// const { body } = require("express-validator");

// const User = require("../model/user");

// const PasswordManager = require("../helpers/passwordManager");
// const validateRequest = require("../middleware/validateRequest");
// const { BadRequestError } = require("../errors");

// const router = express.Router();

// const validators = [
//   body("username").not().isEmpty().withMessage("Username is required"),
//   body("password").trim().not().isEmpty().withMessage("Password is required"),
// ];

// router.post("/signin", validators, validateRequest, async (req, res, next) => {
//   // Find a user
//   const { username, password } = req.body;

//   const user = await User.findOne({ username });

//   if (!user) return next(BadRequestError("Invalid credentials"));

//   // Compare password
//   const passwordsMatch = await PasswordManager.compare(user.password, password);

//   if (!passwordsMatch) return next(BadRequestError("Invalid credentials"));

//   // Generate a token
//   const token = jwt.sign(
//     { id: user._id, username: user.username },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRATION_MS }
//   );
//   const balance = user.balance;
//   // Respond with the token
//   res.status(200).json({ token, balance });
// });

// module.exports = { signinRouter: router };
