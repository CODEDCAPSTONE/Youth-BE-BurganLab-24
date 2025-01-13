const express = require("express");
const User = require("../model/user");
const { requireAuth } = require("../middleware");

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("recipe", "-__v");
  res.status(200).json(user);
});

module.exports = { meRouter: router };
