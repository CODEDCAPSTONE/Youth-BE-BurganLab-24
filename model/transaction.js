const { model, Schema } = require("mongoose");
const user = require("./card");

const TransactionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Transaction", TransactionSchema);
