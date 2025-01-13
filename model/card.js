const { model, Schema } = require("mongoose");
const transaction = require("./transaction");
const exp = require("constants");

const CardSchema = new Schema({
  name: { type: String, required: true },
  cardNumber: { type: Number, unique: true },
  expiryDate: { type: String, required: true, default: "10/28" },
  cvv: { type: Number, unique: true },
  isExpired: { type: Boolean, default: false },
  limit: { type: Number, default: 20 },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Card", CardSchema);
