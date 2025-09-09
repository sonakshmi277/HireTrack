const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "Bubu1222";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
