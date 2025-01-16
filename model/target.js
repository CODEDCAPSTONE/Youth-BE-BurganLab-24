const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const PasswordManager = require("../helpers/passwordManager");
const user = require("./user");

const TargetSchema = new Schema({
  targetName: { type: String, required: true, unique: true },
  balanceTarget: { type: String, default: 0 },
  totalAmount: { type: String, require: true },
  duration: { type: Number, require },
  salary: { type: String, require: true },
  users: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Target", TargetSchema);
