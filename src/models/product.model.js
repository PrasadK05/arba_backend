const mongoose = require("mongoose");

let prod = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  image: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

let Product = mongoose.model("product", prod);

module.exports = Product;
