const express = require("express");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");
const User = require("../../model/user");
const router = express.Router();

router.get("/", requireAuth, validateRequest, async (req, res) => {
  const user = await User.findById(req.user.id).populate("cards");
  let cards = user.cards;
  if (cards.length == 0) cards = await Card.find({user_id: req.user.id});
  res.json(cards);
});

module.exports = { cardsGetRouter: router };
