const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const PasswordManager = require("../helpers/passwordManager");
const user = require("./user");

const TargetSchema = new Schema({
  targetName: { type: String, required: true, unique: true },

  balanceTarget: { type: Number },
  totalAmount: { type: Number, default: 0 },
  duration: { type: Number, require: true },
  monthlyDeduction: { type: Number },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Target", TargetSchema);
