const jwt = require("jsonwebtoken");
//const user = require("../models/user");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login");
    }
    const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedUser;
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
};

module.exports = { userAuth };
