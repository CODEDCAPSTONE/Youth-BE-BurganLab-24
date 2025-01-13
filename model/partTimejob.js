const { model, Schema } = require("mongoose");
const exp = require("constants");
const { type } = require("os");

const ParttimeSchema = new Schema({
  titleJob: { type: String, required: true },
  description: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Parttime", ParttimeSchema);
