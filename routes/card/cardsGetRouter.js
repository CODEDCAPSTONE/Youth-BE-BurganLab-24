const express = require("express");
const Card = require("../../model/card");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

router.get("/", requireAuth, validateRequest, async (req, res) => {
  const cards = await Card.find({ user: req.user.id });
  res.json(cards);
});

module.exports = { cardsGetRouter: router };
