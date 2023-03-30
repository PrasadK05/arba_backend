require("dotenv").config();
const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const token_secret = process.env.TOKEN_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  //   secure: true,
});

const app = express.Router();
app.use(verifyToken);

app.post("/update-avatar", async (req, res) => {
  const file = req.files.pic;
  let { token } = req.headers;
  let decode = jwt.decode(token, token_secret);
  try {
    let result = await cloudinary.uploader.upload(file.tempFilePath);
    let update = await User.findOneAndUpdate(
      { email: decode.email },
      { avatar: result.url }
    );
    return res.send({ status: true, messege: "name updated successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.post("/name", async (req, res) => {
  let { fullName } = req.body;
  let { token } = req.headers;

  let decode = jwt.decode(token, token_secret);

  try {
    let update = await User.findOneAndUpdate(
      { email: decode.email },
      { fullName }
    );
    return res.send({ status: true, messege: "name updated successfully" });
  } catch (e) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

module.exports = app;
