const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodedMsg = jwt.verify(token, "JWT_SECRET_KEY");
    const { _id } = decodedMsg;
    const user = await User.findById(_id); 
    if (!user) {
      throw new Error("user not found");
    }
      req.user = user;
      next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "You are not logged in !",
      Error: err.message,
    });
  }
};

module.exports = authVerification;
