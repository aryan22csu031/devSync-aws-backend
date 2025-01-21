const mongoose = require("mongoose");

const ConnectionReqSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected", "pending"],
        message: "Invalid status type",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ConnectionReqSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionReqSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId === connectionRequest.toUserId) {
    throw new Error("You can't send a connection request to yourself");
  }
  next();
});

const ConnectionReq = mongoose.model("ConnectionReq", ConnectionReqSchema);
module.exports = ConnectionReq;
