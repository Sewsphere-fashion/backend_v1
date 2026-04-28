import config from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

class Guards {
  static createAccessToken = (user) => {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.secret_key,
      { expiresIn: "15m" },
    );
    return token;
  };

  static createRefreshToken = () => {
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    return { refreshToken, hashedToken };
  };

  static hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };

  static comparePassword = (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
  };
}

export default Guards;

// export const createJwt = (user) => {
//   const token = jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     },
//     config.secret_key,
//     { expiresIn: "1d" },
//   );
//   return token;
// };

// export const hashPassword = (password) => {
//   return bcrypt.hashSync(password, 10);
// };

// export const comparePassword = (password, hashPassword) => {
//   return bcrypt.comparePassword(password, hashPassword);
// };
