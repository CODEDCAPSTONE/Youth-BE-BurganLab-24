const express = require("express");
const Job = require("../../model/partTimejob");

const router = express.Router();

router.get("/", async (req, res) => {
  const part = await Job.find();
  res.json(part);
});

module.exports = { jobGetRouter: router };
