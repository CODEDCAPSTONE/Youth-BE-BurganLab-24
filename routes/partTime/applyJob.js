const express = require("express");
const { requireAuth, validateRequest } = require("../../middleware");
const User = require("../../model/user");

const router = express.Router();

// POST route to apply for a part-time job
router.post("/apply", requireAuth, validateRequest, async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(currentUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.jobApply) {
      return res
        .status(400)
        .json({ message: "You have already applied for a job" });
    }

    user.jobApply = true;
    await user.save();

    return res
      .status(201)
      .json({ message: "Your application has been submitted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { applyJobCreateRouter: router };
