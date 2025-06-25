const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is not supported!",
      },
      about: {
        type: String,
      },
    },
  },
  { timestamps: true }
);
const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequest
);
module.exports = ConnectionRequest;
