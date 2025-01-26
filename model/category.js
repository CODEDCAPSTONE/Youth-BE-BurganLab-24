const { model, Schema } = require("mongoose");
const exp = require("constants");

const CategorySchema = new Schema({
  category: { Type: String },
});

module.exports = model("Category", CategorySchema);
