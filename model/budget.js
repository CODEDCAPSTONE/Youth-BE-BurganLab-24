const { model, Schema } = require("mongoose");
const exp = require("constants");

const BudgetSchema = new Schema({
  onlineShopping: { type: Number, default: 0 },
  dining: { type: Number, default: 0 },
  fuel: { type: Number, default: 0 },
  entertainment: { type: Number, default: 0 },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Budget", BudgetSchema);
