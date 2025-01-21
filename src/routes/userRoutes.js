const express = require("express");
const authVerification = require("../middlewares/auth");
const ConnectionReq = require("../models/ConnectionRequests");
const User = require("../models/User");
const userRouter = express.Router();

userRouter.get("/user/requests", authVerification, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionReq.find({
      toUserId: loggedInUser._id,
      status: "pending",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "about",
      "gender",
      "skills",
      "photoUrl"
    ]);
    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/user/connections", authVerification, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionReq.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "about",
        "gender",
        "skills",
        "photoUrl"
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "about",
        "gender",
        "skills",
        "photoUrl"
      ]);

    const data = connections.map((i) => {
      if (i.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return i.toUserId;
      }
      return i.fromUserId;
    });

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});


userRouter.get("/user/feed", authVerification, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const requests = await ConnectionReq.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hiddenUsers = new Set();
    requests.forEach((req) => {
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(["firstName", "lastName", "age", "about", "gender", "skills", "photoUrl"])
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.log(err);

    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;