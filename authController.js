// controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../model/user");
const OTP = require("../model/otp");
const Card = require("../model/card");

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

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role, otp } = req.body;
    // Check if all details are provided
    if (!username || !email || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }
    // Secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error hashing password",
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    console.log("newUser", newUser);

    // Generate unique card number and CVV
    let cardNumber, cvv;
    do {
      cardNumber = generateCardNumber();
      console.log("cardNumber", cardNumber);
    } while (await Card.exists({ cardNumber }));

    do {
      cvv = generateCvv();
    } while (await Card.exists({ cvv }));

    // Create a new card for the user
    const newCard = await Card.create({
      name: `${username}'s Card`,
      cardNumber,
      expiryDate: "10/28",
      cvv,
      balance: 0,
      user: newUser._id,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      card: newCard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
