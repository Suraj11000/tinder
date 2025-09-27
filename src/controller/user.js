const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const { ConnectionRequestSchema } = require("../models/connection");
const { BodyValidator, updateUserProfile } = require("../utils/validation");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { get } = require("mongoose");

exports.GetUserData = async (req, res) => {
  try {
    const getUserData = await UserModel.find();
    if (!getUserData) {
      res.status(404).send("user data not found");
    }
    res.status(200).send({
      message: "success",
      users: getUserData,
    });
  } catch (err) {
    res.status(500).send("error getting user", err);
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const { Email } = req.body;
    console.log(Email);
    const userByEmail = await UserModel.find({ Email });
    if (!userByEmail) {
      res.status(404).send("no user found with this email", Email);
    }
    res.status(200).send({
      message: "success",
      user: userByEmail,
    });
  } catch (err) {
    res.status(500).send("internal server error", err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;
    console.log(data);
    updateUserProfile(req);
    const updateData = await UserModel.findByIdAndUpdate(userId, data);
    if (!updateData) {
      res.status(404).send("error updating user data");
    }
    res.status(200).send({
      message: "success",
      data: updateData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error :" + err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const deleteUser = await UserModel.findByIdAndDelete({ _id: userId });
    if (!deleteUser) {
      res.status(404).send("error deleting user.");
    }
    res.status(200).send({
      message: "success",
      data: "user deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const getUser = await UserModel.findById({ _id });
    if (!getUser) {
      return res.status(404).send("User not found.");
    }
    return res.status(200).json({
      message: "success",
      user: getUser,
    });
  } catch (err) {
    return res.status(500).send("Error :" + err.message);
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;
    const { _id } = req.user;
    const user = await UserModel.findById({ _id });
    console.log(
      user.Password,
      "this is the pass for the user" + user.FirstName
    );
    const isCurrentPassValid = await bcrypt.compare(currentPass, user.Password);
    if (!isCurrentPassValid) {
      return res.status(400).json({
        message: "Failed to forget password",
        reason: "current password is wrong.",
      });
    }
    const hashNewPass = await bcrypt.hash(newPass, 10);
    console.log(hashNewPass, "this si the new");
    const updatePass = await UserModel.findByIdAndUpdate(_id, {
      Password: hashNewPass,
    });

    if (!updatePass) {
      return res.status(500).send("Error while forgetting the password.");
    }
    return res.status(200).json({
      message: "Success",
      data: "password updated successfully.",
    });
  } catch (err) {
    return res.status(500).send("Error :" + err.message);
  }
};

exports.getConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const connection = await ConnectionRequestSchema.find({
      $or: [
        { toUserId: userId, status: "accecpted" },
        { fromUserId: userId, status: "accecpted" },
      ],
    })
      .populate("fromUserId", [
        "FirstName",
        "LastName",
        "Age",
        "Gender",
        "Email",
      ])
      .populate("toUserId", [
        "FirstName",
        "LastName",
        "Age",
        "Gender",
        "Email",
      ]);
    if (!connection) {
      return res.status(400).send("you dont have any connectins.");
    }
    console.log(connection, "data");

    const data = connection.map((res) => {
      if (userId.toString() == res.fromUserId._id.toString()) {
        return res.toUserId;
      } else {
        return res.fromUserId;
      }
    });

    return res.status(200).json({
      message: "all connecton fetched successfully",
      data: data,
    });
  } catch (err) {
    return res.status(500).send("Error : " + err.message);
  }
};

exports.getRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequestSchema.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", ["FirstName", "LastName", "Gender"]);
    if (requests.length == 0) {
      return res.status(400).send("you dont have any requests");
    }
    return res.status(200).json({
      message: "requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    return res.status(500).send("Error : " + err.message);
  }
};

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.params.page) || 1
    const limit = parseInt(req.params.limit) || 10
    const skipData = (page -1) * limit
    const getFeed = await ConnectionRequestSchema.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .select("fromUserId toUserId")
      // .populate("fromUserId", ["FirstName", "LastName"])
      // .populate("toUserId", ["FirstName", "LastName"]);
    if (!getFeed) {
      return res.status(404).send("error fetching feed");
    }

    const hideUser = new Set();
    getFeed.forEach((res) => {
      hideUser.add(res.fromUserId.toString());
      hideUser.add(res.toUserId.toString());
    });

    console.log(hideUser, "this are hidden");
    const userFeed = await UserModel.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUser) },
        },
        {
          _id: { $ne: userId },
        },
      ],
    }).skip(skipData).limit(limit)
    return res.status(200).json({
      message: "requests fetched successfully",
      data: userFeed,
      page : page,
      limit : limit
    });
  } catch (err) {
    return res.status(500).send("Error : " + err.message);
  }
};
