const { model, Schema } = require("mongoose");
const exp = require("constants");

const ParttimeSchema = new Schema({
  informtion: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Parttime", ParttimeSchema);
