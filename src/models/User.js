const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(emailid) {
        if (!validator.isEmail(emailid)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String || Number,
      required: true,
      minLength: 8,
      maxLength: 256,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["male", "female", "others"].includes(val)) {
          throw new Error("Invalid gender data");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    about: {
      type: String,
      default: "default about",
    },
    skills: {
      type: [String],
      validate(arr) {
        if (arr.length > 30) {
          throw new Error("you can add upto 30 skills only");
        } else if (arr.length === 0) {
          throw new Error("you must add at least one skill");
        }
      },
    },
  },{
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function(){
  const user = this;
  const token = jwt.sign({ _id: this._id }, "JWT_SECRET_KEY", {
    expiresIn: "1h",
  });
  return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
