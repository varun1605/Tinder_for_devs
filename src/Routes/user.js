const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const SAFE_DATA = "firstName lastName age gender skills photoURL";

//The API fetches all the request that the logged in user has received.
userRouter.get("/user/connections/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const getMyRequests = await ConnectionRequest.find({
      toUserID: loggedInUser,
      status: "interested",
    }).populate("fromUserID", ["firstName", "lastName", "photoURL", "skills"]);
    res.json({ message: "Data fetched successfully!! ", data: getMyRequests });
  } catch (err) {
    res.status(400).json({ ERROR: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserID: loggedInUser._id, status: "accepted" },
        { fromUserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserID", SAFE_DATA)
      .populate("toUserID", SAFE_DATA);

    console.log(connectionRequests);

    const filteredData = connectionRequests.map((row) => {
      if (row.fromUserID._id.toString() == loggedInUser._id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });
    res.json({ filteredData });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//FEED API

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserID: loggedInUser._id },
        {
          toUserID: loggedInUser._id,
        },
      ],
    }).select("fromUserID toUserID");

    const hideUserFromLoggedInUser = new Set();

    connectionRequests.forEach((request) => {
      hideUserFromLoggedInUser.add(request.fromUserID.toString());
      hideUserFromLoggedInUser.add(request.toUserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromLoggedInUser) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_DATA);

    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
