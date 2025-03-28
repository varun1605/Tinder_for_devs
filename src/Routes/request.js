const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
const mongoose = require("mongoose");

// requestRouter.post(
//   "/request/send/interested/:touserId",
//   userAuth,
//   async (req, res) => {
//     const user = req.user;
//     res.send(`${user.firstName} sent the connection request!`);
//   }
// );

requestRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserID = req.user._id;

      const toUserID = req.params.toUserID;
      const status = req.params.status;

      const toUser = await User.findById(toUserID);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      if (fromUserID == toUserID) {
        return res.status(400).json({
          message: "Cannot send the request to same user!",
        });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type :" + status });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exists!" });
      }
      const connectionData = new ConnectionRequest({
        fromUserID,
        toUserID,
        status,
      });
      const data = await connectionData.save();
      if (status == "interested") {
        res.json({
          message: "Connection request sent successfully!",
          data,
        });
      }
      if (status == "ignored") {
        res.json({
          message: "Connection request ignored!",
          data,
        });
      }
    } catch (err) {
      res.status(400).send("ERROR " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      /**check if the requestId exists in the database. 
      As per the database that stores the requests, the loggedIn user in this case must be the to userId.
      that means, when i request is send "to" a user, now that "to" user must be logged in order to accept or reject the request.
      if the status is valid
      the user who will perform the action for either accepting or rejecting the request shall be logged in. 
      Also the status must be interested, so if a user ignores a profile then he cannot be there, that means, in case I ignores a profile of someone, 
       he cannot take any action on it. 
       */
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserID: loggedInUser._id,
        status: "interested",
      });
      console.log("Data" + loggedInUser._id);

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).json({ ERROR: err.message });
    }
  }
);
module.exports = requestRouter;
