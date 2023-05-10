const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/envConfig");

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const comparePassword = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};

const createToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  hashedPassword,
  comparePassword,
  createToken,
};
