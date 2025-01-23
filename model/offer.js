const { model, Schema } = require("mongoose");
const exp = require("constants");

const offerSchema = new Schema({
  offerName: { type: String, required: true },
  description: { type: String, required: true },
  discount: { type: Number },
  image: { image: String },
});

module.exports = model("Offer", offerSchema);
