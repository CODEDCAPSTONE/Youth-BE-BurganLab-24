const jwt = require("jsonwebtoken");
const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
});

module.exports = model("User", UserSchema);
