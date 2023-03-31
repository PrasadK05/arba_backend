const mongoose = require("mongoose");

let cat = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

let Category = mongoose.model("category", cat);

module.exports = Category;
