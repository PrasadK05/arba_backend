require("dotenv").config();
const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const token_secret = process.env.TOKEN_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const app = express.Router();
app.use(verifyToken);

// Category Create-Operation
app.post("/add-category", async (req, res) => {
  let { name, slug } = req.body;
  let file = req.files.img;
  let { token } = req.headers;
  let decode = jwt.decode(token, token_secret);
  try {
    let result = await cloudinary.uploader.upload(file.tempFilePath);
    let user = await User.findOne({ email: decode.email });
    let createCat = await Category.create({
      name,
      slug,
      image: result.url,
      owner: user._id,
    });
    return res.send({ status: true, messege: "category added successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

// Category Update-Operation
app.patch("/update/category-image/:id", async (req, res) => {
  let { id } = req.params;
  let file = req.files.img;
  try {
    let cat = await Category.findById({ _id: id });
    let array = cat.image.split("/");
    let asset = array[array.length - 1].split(".");
    let result = await cloudinary.uploader.upload(file.tempFilePath);
    let updateCat = await Category.findByIdAndUpdate(
      { _id: id },
      { image: result.url }
    );
    let del = await cloudinary.uploader.destroy(asset[0]);
    return res.send({ status: true, messege: "image updated successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.patch("/update/category-data/:id", async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  try {
    let updateCat = await Category.findByIdAndUpdate({ _id: id }, { ...data });
    return res.send({ status: true, messege: "data updated successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

// Category Read-Operation
app.get("/get-categories", async (req, res) => {
  try {
    let categories = await Category.find();
    return res.send({ status: true, messege: "OK", result: categories });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.get("/get-category/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let category = await Category.findById({ _id: id });
    return res.send({ status: true, messege: "OK", result: category });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.get("/get-categoryByName", async (req, res) => {
  let { name } = req.query;
  try {
    let category = await Category.find({ name });
    return res.send({ status: true, messege: "OK", result: category });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

// Category Delete-Operation
app.delete("/delete-category/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let cat = await Category.findById({ _id: id });
    let array = cat.image.split("/");
    let asset = array[array.length - 1].split(".");
    let category = await Category.findByIdAndDelete({ _id: id });
    let result = await cloudinary.uploader.destroy(asset[0]);
    return res.send({ status: true, messege: "category deleted successfully" });
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
