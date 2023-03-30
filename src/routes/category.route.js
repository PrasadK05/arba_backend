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
// app.use(verifyToken);

app.post("/add-category", async (req, res) => {
  let { name, slug } = req.body;
  let file = req.files;
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

app.post("/update/category-image/:id", async (req, res) => {
  let { id } = req.params;
});

module.exports = app;

// {
//     "fullName":"prasad",
//     "email":"kardeashutosh61299@gmail.com",
//     "password":"123456",
//     "userName":"prasad"
//   }
