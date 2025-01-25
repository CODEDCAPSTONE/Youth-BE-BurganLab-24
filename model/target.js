const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const PasswordManager = require("../helpers/passwordManager");
const user = require("./user");

const TargetSchema = new Schema({
  targetName: { type: String, required: true, unique: true },
  balanceTarget: { type: Number, default: 0 },
  totalAmount: { type: String, require: true },
  duration: { type: Number, require: true },
  income: { type: String, require: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Target", TargetSchema);
