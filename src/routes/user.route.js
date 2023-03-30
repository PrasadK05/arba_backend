require("dotenv").config();
const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { generateOTP } = require("../utils/otp");
const { sendMail } = require("../utils/mail");

const token_secret = process.env.TOKEN_KEY;
const refreshToken_secret = process.env.REFRESHTOKEN_KEY;

const app = express.Router();

app.post("/signup", async (req, res) => {
  let data = req.body;
  let already_exist = await User.findOne({ email: data.email });
  if (already_exist) {
    return res.send({ status: false, message: "user already registered" });
  }
  let hash = await argon2.hash(data.password);
  let user = await User.create({ ...data, password: hash });
  if (user) {
    return res.send({
      status: true,
      messege: "user created successfully",
    });
  } else {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      if (await argon2.verify(user.password, password)) {
        let bdy = {
          email: user.email,
          fullName: user.fullName,
          userName: user.userName,
        };
        let token = jwt.sign(bdy, token_secret, {
          expiresIn: "7 days",
        });

        let refreshToken = jwt.sign(bdy, refreshToken_secret, {
          expiresIn: "28 days",
        });
        res.status(200).send({ status: true, token, refreshToken });
      } else {
        return res.send({ status: false, messege: "Wrong Password" });
      }
    } else {
      return res.send({ status: false, messege: "User not found" });
    }
  } catch (e) {
    return res.send({ status: false, messege: "User not found" });
  }
});

app.post("/get-otp", async (req, res) => {
  let { email } = req.body;
  const otpGenerate = generateOTP();

  try {
    let user = await User.findOne({ email });
    if (user) {
      try {
        let updateOtp = await User.updateOne({ email }, { otp: otpGenerate });

        let mail = await sendMail({
          to: email,
          OTP: otpGenerate,
        });
        if (mail) {
          return res.send({
            status: true,
            otp: "otp sent to register email id",
          });
        } else {
          return res.send({ status: false, massage: "something went wrong" });
        }
      } catch (error) {
        return res.send({ status: false, massage: "something went wrong" });
      }
    }
  } catch (error) {
    return res.send({ status: false, messege: "User not found" });
  }
});

app.post("forgot-password", async (req, res) => {
  let { email, otp, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.send("user not found !");
  }
  if (user.otp != otp) {
    return res.send({ status: false, messege: "wrong otp" });
  }
  let hash = await argon2.hash(password);
  try {
    let updateUser = await User.findOneAndUpdate({ email }, { password: hash });
    res.send({ status: true, messege: "password updated successfully" });
  } catch (error) {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.get("/refresh_token", async (req, res) => {
  const reToken = req.headers.refreshtoken;

  if (!reToken) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const verification = await jwt.verify(reToken, refreshToken_secret);
    if (verification) {
      let user = await User.findOne({ email: verification.email });
      if (user) {
        let tk = jwt.sign(
          { email: user.email, name: user.name },
          token_secret,
          {
            expiresIn: "1 min",
          }
        );

        res
          .status(200)
          .cookie("token", tk, cookieOption)
          .send({ status: true, token: tk, refreshToken: reToken });
      } else {
        return res.status(401).send("Operation not allowed.");
      }
    } else {
      return res.status(401).send("Operation not allowed.");
    }
  } catch (e) {
    return res.status(401).send(e.message);
  }
});

module.exports = app;
