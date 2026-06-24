const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import crypto from "crypto"

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};
export const verifyPassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};
export const generateToken = (payload, expiresIn) => {
  return jwt.sign({ ...payload }, process.env.JWT_SECRET, { expiresIn });
};
export const verifyToken = (token) => {
  try {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    return isValid;
  } catch (error) {
    return false;
  }
};
 export const generateOTP = () => {
  return crypto.randomInt(1000, 9999);
};

