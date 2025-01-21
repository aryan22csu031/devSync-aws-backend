const express = require("express");
const requestRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
const ConnectionReq = require("../models/ConnectionRequests");
const User = require("../models/User");
const authVerification = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const isExist = await ConnectionReq.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (isExist) {
        return res
          .status(400)
          .json({ success: false, error: "Connection request already exists" });
      }


      const connectionRequest = new ConnectionReq({
        fromUserId,
        toUserId,
        status: "pending",
      });

      const data = await connectionRequest.save();
      res.status(200).json({
        success: true,
        message: `Connection Request ${status} Successfully`,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || err,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authVerification,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(req.params.status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const ConnectionRequest = await ConnectionReq.findOne({
        _id: req.params.requestId,
        toUserId: loggedInUser._id,
        status: "pending",
      });

      if (!ConnectionRequest) {
        return res.status(404).json({ error: "Connection Request not found" });
      }

      ConnectionRequest.status = req.params.status;
      await ConnectionRequest.save();
      res.status(200).json({
        success: true,
        message: `Connection Request ${req.params.status} Successfully`,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message || err });
    }
  }
);

module.exports = requestRouter;
