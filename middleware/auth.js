require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRETKEY
    );

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("THIS IS THE MIDDLEWARE ERROR");
    err.status = err.status || 401;
    return next(err);
  }
};

module.exports = { authenticate };