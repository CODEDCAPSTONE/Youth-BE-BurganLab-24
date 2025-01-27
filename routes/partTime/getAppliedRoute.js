const express = require("express");
const Target = require("../../model/target");
const { requireAuth } = require("../../middleware");
const User = require("../../model/user");
const router = express.Router();

router.get("/appliedJobs", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("appliedJobs");
  const jobs = user.appliedJobs;

  res.json(jobs);
});

module.exports = { appliedGetRouter: router };
