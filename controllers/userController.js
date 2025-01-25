const User = require("../../model/user");

router.post("/income", requireAuth, updateIncome);
exports.updateIncome = async (req, res) => {
  try {
    const { userId, income } = req.body;

    if (!userId || income === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID and income are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.income = income;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
