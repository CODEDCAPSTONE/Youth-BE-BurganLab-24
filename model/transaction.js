const { model, Schema } = require("mongoose");
const card = require("./card");

const TransactionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
});

module.exports = model("Transaction", TransactionSchema);
