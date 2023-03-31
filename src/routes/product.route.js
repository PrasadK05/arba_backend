require("dotenv").config();
const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const token_secret = process.env.TOKEN_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express.Router();
// app.use(verifyToken);

// Product Create-Operation
app.post("/add-product", async (req, res) => {
  let { title, description, price, category } = req.body;
  let file = req.files.img;
  let { token } = req.headers;
  let decode = jwt.decode(token, token_secret);
  try {
    let result = await cloudinary.uploader.upload(file.tempFilePath);
    let user = await User.findOne({ email: decode.email });
    let cat = await Category.findById({ _id: category });
    let createProd = await Product.create({
      title,
      description,
      price,
      category: cat._id,
      image: result.url,
      owner: user._id,
    });
    return res.send({ status: true, messege: "product added successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ status: false, messege: "something went wrong" });
  }
});

// Product Update-Operation
app.patch("/update/product-image/:id", async (req, res) => {
  let { id } = req.params;
  let file = req.files.img;
  try {
    let prod = await Product.findById({ _id: id });
    let array = prod.image.split("/");
    let asset = array[array.length - 1].split(".");
    let result = await cloudinary.uploader.upload(file.tempFilePath);
    let updateProd = await Product.findByIdAndUpdate(
      { _id: id },
      { image: result.url }
    );
    let del = await cloudinary.uploader.destroy(asset[0]);
    return res.send({ status: true, messege: "image updated successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.patch("/update/product-data/:id", async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  try {
    let updateProd = await Product.findByIdAndUpdate({ _id: id }, { ...data });
    return res.send({ status: true, messege: "data updated successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

// Product Read-Operation
app.get("/get-products", async (req, res) => {
  try {
    let products = await Product.find();
    return res.send({ status: true, messege: "OK", result: products });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.get("/get-product/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let product = await Products.findById({ _id: id });
    return res.send({ status: true, messege: "OK", result: product });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.get("/select-product", async (req, res) => {
  let { filterByCat, sort } = req.query;
  if (filterByCat && sort) {
    let val = sort === "asc" ? 1 : -1;
    try {
      let prod = await Product.find({ category: filterByCat }).sort({
        price: val,
      });
      return res.send({ status: true, messege: "OK", result: prod });
    } catch (error) {
      console.log(error);
      return res.send({ status: false, messege: "something went wrong" });
    }
  }
  if (filterByCat) {
    try {
      let prod = await Product.find({ category: filterByCat });
      return res.send({ status: true, messege: "OK", result: prod });
    } catch (error) {
      console.log(error);
      return res.send({ status: false, messege: "something went wrong" });
    }
  }
  if (sort) {
    let val = sort === "asc" ? 1 : -1;
    try {
      let prod = await Product.find().sort({
        price: val,
      });
      return res.send({ status: true, messege: "OK", result: prod });
    } catch (error) {
      console.log(error);
      return res.send({ status: false, messege: "something went wrong" });
    }
  }
});

// Product Delete-Operation
app.delete("/delete-product/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let prod = await Product.findById({ _id: id });
    let array = cat.image.split("/");
    let asset = array[array.length - 1].split(".");
    let prods = await Product.findByIdAndDelete({ _id: id });
    let result = await cloudinary.uploader.destroy(asset[0]);
    return res.send({ status: true, messege: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.delete("/delete-multiproduct", async (req, res) => {
  let { id } = req.body;
  try {
    let prods = await Product.deleteMany({ _id: { $in: id } });
    return res.send({ status: true, messege: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ status: false, messege: "something went wrong" });
  }
});
module.exports = app;

// {
//   "fullName":"prasad",
//   "email":"kardeashutosh61299@gmail.com",
//   "password":"123456",
//   "userName":"prasad"
// }
