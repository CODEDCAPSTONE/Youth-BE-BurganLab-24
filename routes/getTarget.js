const express = require("express");
const Target = require("../model/target");
const { requireAuth } = require("../middleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const target = await Target.findById(req.user.id).populate("user");

    if (!target) {
      return res.status(404).json({ error: "target not found." });
    }

    res.status(200).json({
      targetName: target.targetName,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { targetGetRouter: router };
