const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const PasswordManager = require("../helpers/passwordManager");
const transaction = require("./transaction");
const Card = require("./card"); // Import the Card model
const budget = require("./budget");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, require: true },
  email: { type: String },
  income: { type: Number, default: 200 },
  student: { type: Boolean, default: false },
  jobApply: { type: Boolean, default: false },

  appliedJobs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  targets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Target",
    },
  ],
  budgets: {
    type: Schema.Types.ObjectId,
    ref: "Budget",
  },
});

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

module.exports = model("User", UserSchema);
