const express = require("express");
const Job = require("../../model/partTimejob");
const { requireAuth } = require("../../middleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const part = await Job.find();
  res.json(part);
});

module.exports = { jobGetRouter: router };
