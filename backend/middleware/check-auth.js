const jwt = require("jsonwebtoken");

const NewError = require("../models/new-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new NewError("Authentication failed!", 403));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return next(new NewError("Authentication failed!", 403));
  }
};
