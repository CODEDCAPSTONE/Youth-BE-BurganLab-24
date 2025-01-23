const { model, Schema } = require("mongoose");
const exp = require("constants");

const offerSchema = new Schema({
  offerName: { type: String, required: true },
  description: { type: String, required: true },
  discount: { type: Number },
});

module.exports = model("Offer", offerSchema);
