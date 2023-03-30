require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;
const connect = require("./config/db");
const userRoute = require("./routes/user.route");
const userProfile = require("./routes/profile.route");
const categoryRoute=require("./routes/category.route");
const fileupload = require("express-fileupload");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload({ useTempFiles: true }));

app.use("/user", userRoute);
app.use("/profile", userProfile);
app.use("/category", categoryRoute);

app.get("/", (req, res) => {
  res.send("ARBA SERVER");
});

app.listen(PORT, async () => {
  await connect();
  console.log(`running at ${PORT}`);
});
