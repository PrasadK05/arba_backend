require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;
const connect = require("./config/db");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ARBA SERVER");
});

app.listen(PORT, async () => {
  await connect();
  console.log(`running at ${PORT}`);
});
