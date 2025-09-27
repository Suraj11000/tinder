const jwt = require("jsonwebtoken");
require("dotenv").config();
const AuthValidation = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token, "here is the token");
    if (!token) {
      return res.status(404).send("please provide the token.");
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res
        .status(400)
        .send("Invalid or expire token, please provide valid token");
    }
    req.user = verifyToken

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Error" + err.message,
    });
  }
};

module.exports = AuthValidation;
