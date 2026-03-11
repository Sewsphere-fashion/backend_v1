import config from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createJwt = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.secret_key,
    { expiresIn: "1d" },
  );
  return token;
};

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (password, hashPassword) => {
  return bcrypt.comparePassword(password, hashPassword);
};
