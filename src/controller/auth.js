const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const { BodyValidator } = require("../utils/validation");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.CreateUser = async (req, res) => {
  try {
    const { FirstName, LastName, Password, Age, Gender, Email } = req.body;
    console.log(FirstName, LastName, Password, Age, Gender);
    BodyValidator(req);
    const hashPass = await bcrypt.hash(Password, 10);
    const isUserExist = await UserModel.findOne({ Email: Email });
    if (isUserExist) {
      return res.status(400).json({
        message: "User already present with this Email id",
        Email,
      });
    }
    const createUser = await UserModel.create({
      FirstName,
      LastName,
      Password: hashPass,
      Age,
      Gender,
      Email,
    });
    if (!createUser) {
      res.status(500).send("error creating user");
    }
    res.status(200).send("user created successfully.");
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ errors: err.errors });
    }
    console.log(err, "this is the error getting");
    res.status(500).send("Error : " + err.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log("login working");
    const { Email, Password } = req.body;
    const isUserExist = await UserModel.findOne({ Email });
    if (!isUserExist) {
      return res
        .status(400)
        .json("user not present with this email id : " + Email);
    }
    // let hashPass = isUserExist.Password;
    // const isValidatePass = await bcrypt.compare(Password, hashPass);

    // best practices do at model level
    const isValidatePass = await isUserExist.bcryptPass(Password);
    if (!isValidatePass) {
      return res.status(400).json("Wrong Password");
    }

    // const token = jwt.sign({ _id: isUserExist._id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_TOKEN_EXPIRY,
    // });

    // best practices do at model level
    const token = await isUserExist.getJwt();

    res.cookie("token", token, { expires: new Date(Date.now() + 1000000) });
    return res.status(200).json({
      message: "User login successfully.",
    });
  } catch (err) {
    return res.status(500).json("Error : " + err.message);
  }
};

exports.logOutUser = async (req, res) => {
  try {
    const logout = res.cookie("token", null, {
      expires: new Date(Date.now())
    });
    if(!logout){
        return res.status(500).send("error while login out")
    }
    return res.status(200).send("user logout successfully.")
  } catch (err) {
    return res.status(500).send("Error : " + err.message);
  }
};
