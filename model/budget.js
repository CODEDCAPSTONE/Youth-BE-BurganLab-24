const { model, Schema } = require("mongoose");
const exp = require("constants");

const BudgetSchema = new Schema({
  category: {
    type: String,
    enum: ["Online shopping", "Restaurant", "Fuel", "Other", "Entertainment"],
  },
  limit: { type: Number, default: 20 },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Budget", BudgetSchema);
