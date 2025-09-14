const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["dishwasher", "pizzaoven"],
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  devices: {
    type: [deviceSchema],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
