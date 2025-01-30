const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

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

module.exports = requestRouter;
