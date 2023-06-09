const mongoose = require("mongoose");

let users = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/128/236/236832.png",
  },
  otp: { type: String },
});

let User = mongoose.model("user", users);

module.exports = User;
