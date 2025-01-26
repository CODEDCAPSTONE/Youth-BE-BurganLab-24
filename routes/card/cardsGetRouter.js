const express = require("express");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");
const User = require("../../model/user");
const router = express.Router();

router.get("/", requireAuth, validateRequest, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cards");
  const cards = user.cards;
  res.json(cards);
});

module.exports = { cardsGetRouter: router };
