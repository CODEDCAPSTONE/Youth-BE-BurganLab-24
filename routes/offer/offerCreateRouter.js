const express = require("express");
const { body } = require("express-validator");
const Offer = require("../../model/offer");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const validators = [
  body("offerName").not().isEmpty().withMessage("OfferName is required"),
  body("description").not().isEmpty().withMessage("Description is required"),
  body("discount").not().isEmpty().withMessage("Discount is required"),
];

// POST route to create a new target
router.post("/", validators, validateRequest, async (req, res) => {
  const { offerName, description, discount } = req.body;
  try {
    if (req.file)
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    const newOffer = await Offer.create(req.body);
    res.status(201).json(newOffer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { offerCreateRouter: router };
