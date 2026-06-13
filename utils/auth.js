const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};
const verifyPassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};
const generateToken = (payload, expiresIn) => {
  return jwt.sign({ ...payload }, process.env.JWT_SECRET, { expiresIn });
};
const verifyToken = (token) => {
  try {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    return isValid;
  } catch (error) {
    return false;
  }
};
module.exports = { hashPassword, verifyPassword, generateToken, verifyToken };
