const { model, Schema } = require("mongoose");

const TransactionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = model("Transaction", TransactionSchema);
