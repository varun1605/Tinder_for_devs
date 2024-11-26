const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateUserEditData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUserEditData(req)) {
      throw new Error("Invalid edit request");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    console.log(user);
    await user.save();
    res.send("User profile updated successfully!!");
  } catch (err) {
    res.status(400).send("ERR: " + err.message);
  }
});

module.exports = profileRouter;
