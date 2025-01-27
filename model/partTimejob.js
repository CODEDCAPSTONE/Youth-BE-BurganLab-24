const { model, Schema } = require("mongoose");
const exp = require("constants");

const jobSchema = new Schema({
  titleJob: { type: String, required: true },
  description: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Job", jobSchema);
