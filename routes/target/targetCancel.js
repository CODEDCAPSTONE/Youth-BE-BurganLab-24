const express = require("express");
const router = express.Router();
const Target = require("../../model/target");
const User = require("../../model/user");
const { requireAuth } = require("../../middleware");

// Route to cancel a target
router.post("/cancel/:targetId", async (req, res) => {
  requireAuth;
  const { targetId } = req.params;

  try {
    // Find the target
    const target = await Target.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: "Target not found" });
    }

    // Find the user
    const user = await User.findById(req.user.id).populate("cards");
    const targets = user.targets;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any cards
    if (user.cards.length === 0) {
      return res.status(400).json({ message: "User has no cards" });
    }

    // Log the cards before the balance transfer
    console.log("Cards before transfer:", user.cards);

    // Transfer the totalAmount to the first card
    user.cards[0].balance += target.totalAmount;

    // Save the updated card balance
    await user.cards[0].save();

    // Log the cards after the balance transfer
    console.log("Cards after transfer:", user.cards);

    // Remove the target from the user's targets array
    user.targets = targets.filter((t) => t.toString() !== targetId);

    // Save the updated user and remove the target
    await user.save();
    await Target.findByIdAndDelete(targetId);

    res.status(200).json({ message: "Target canceled and amount transferred" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { targetCancelRouter: router };
