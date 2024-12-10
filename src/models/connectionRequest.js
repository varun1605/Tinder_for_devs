const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is not supported!",
      },
    },
  },
  { timestamps: true }
);
