const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
require("dotenv").config();

const UserSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      index : true //index added
    },
    LastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 400,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("please enter a strong password.");
        }
      },
    },
    Age: {
      type: Number,
      required: true,
      trim: true,
    },
    Gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female"].includes(value.toLowerCase())) {
          throw new Error("Invalid data for the gender.");
        }
      },
    },
    Email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("please provide proper email format");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

//index
UserSchema.index({FirstName : 1, LastName : 1})

// methods
UserSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
  });
  return token;
};

UserSchema.methods.bcryptPass = async function (unHashPassword) {
  const pass = this;
  const hasPass = await bcrypt.compare(unHashPassword, pass.Password);
  return hasPass
};

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserModel };
