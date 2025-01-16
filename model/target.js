const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const PasswordManager = require("../helpers/passwordManager");
const user = require("./user");

const TargetSchema = new Schema({
  targetName: { type: String, required: true, unique: true },
  balanceTarget: { type: String, require: true, default: 0 },
  totalAmount: { type: String, require: true },
  duration: { type: Number, require },
  users: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("User", UserSchema);
