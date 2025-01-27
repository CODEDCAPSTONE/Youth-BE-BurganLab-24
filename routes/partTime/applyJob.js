const express = require("express");
const { requireAuth, validateRequest } = require("../../middleware");
const User = require("../../model/user");
const Job = require("../../model/partTimejob");

const router = express.Router();

router.post("/apply", requireAuth, validateRequest, async (req, res) => {
  const { jobId } = req.body;

  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(currentUser.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (user.appliedJobs.includes(job._id)) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    user.appliedJobs.push(job._id);
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
