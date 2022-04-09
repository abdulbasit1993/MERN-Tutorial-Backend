const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: "./config.env" });

require("./db/conn");

// const User = require("./model/userSchema");

app.use(express.json());

app.use(require("./router/auth"));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`Hello World from the server`);
});

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});
