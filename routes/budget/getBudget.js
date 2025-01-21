const express = require("express");
const Budget = require("../../model/budget");

const router = express.Router();

router.get("/", async (req, res) => {
  const budget = await Budget.find();
  res.json(budget);
});

module.exports = { budgetGetRouter: router };
