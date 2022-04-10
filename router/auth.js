const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send(`Hello World from the server router js`);
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res
      .status(422)
      .json({ error: "Please fill all the fields properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email Already Exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Passwords Do Not Match" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });

      // password hashing function will be called first here at this line

      await user.save();

      res.status(201).json({ message: "User Registered Successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please Fill the Data" });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.json({ message: "User Signed In Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
