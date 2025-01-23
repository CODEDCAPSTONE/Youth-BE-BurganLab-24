const express = require("express");
const { body } = require("express-validator");
const Job = require("../../model/partTimejob");
const { requireAuth, validateRequest } = require("../../middleware");

const router = express.Router();

const validators = [
  body("titleJob").not().isEmpty().withMessage("titleJob is required"),
  body("description").not().isEmpty().withMessage("description is required"),
];

// POST route to create a new target
router.post("/", validators, validateRequest, async (req, res) => {
  const { titleJob, description, isExpired } = req.body;
  try {
    const newPart = await Job.create(req.body);
    res.status(201).json(newPart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { partTimeCreateRouter: router };
