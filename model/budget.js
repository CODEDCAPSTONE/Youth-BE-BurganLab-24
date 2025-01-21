const { model, Schema } = require("mongoose");
const exp = require("constants");

const BudgetSchema = new Schema({
  category: { type: String, require: true },
  limit: { type: Number, default: 20 },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Budget", BudgetSchema);
