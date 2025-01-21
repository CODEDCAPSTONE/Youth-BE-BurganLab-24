const express = require("express");
const Target = require("../../model/target");

const router = express.Router();

router.get("/", async (req, res) => {
  const targets = await Target.find();
  res.json(targets);
});

module.exports = { targetGetRouter: router };
