const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw new Error("Invalid credentials!!");
    }

    const isPasswordValid = await userData.validatePassword(password);
    if (isPasswordValid) {
      //Only if the email and password is correct then only we will be able to get the userId, which later helps us to generate the jwt.

      //Creating a JWT token inside the userSchema to keep the code clean and for the best practices.

      const token = await userData.getJWT();

      //generating a token indside a cookie.
      res.cookie("token", token);

      res.send("Login successful!!!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    validateSignUp(req);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save({ runValidators: true });
    res.send("Data sent successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
