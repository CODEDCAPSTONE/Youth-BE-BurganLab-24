const { model, Schema } = require("mongoose");
const transaction = require("./transaction");
const exp = require("constants");
const { type } = require("os");

const CardSchema = new Schema({
  name: { type: String, required: true },
  cardNumber: { type: Number, unique: true },
  expiryDate: { type: String, required: true, default: "10/28" },
  cvv: { type: Number, unique: true },
  balance: { type: Number, default: 500 },

  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Card", CardSchema);
