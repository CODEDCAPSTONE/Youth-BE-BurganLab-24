// routes/authRoutes.js
const express = require("express");
const authController = require("./authController");
const router = express.Router();

router.post("/signup", authController.signup);
module.exports = router;
