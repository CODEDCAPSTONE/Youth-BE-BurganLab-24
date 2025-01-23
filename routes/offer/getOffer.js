const express = require("express");
const Offer = require("../../model/offer");

const router = express.Router();

router.get("/", async (req, res) => {
  const offer = await Offer.find();
  res.json(offer);
});

module.exports = { offerGetRouter: router };
