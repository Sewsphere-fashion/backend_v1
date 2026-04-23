import { Schema, model } from "mongoose";

const requireIfLocal = function () {
  return this.authProvider === "local";
};

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: requireIfLocal,
      trim: true,
    },
    lastName: {
      type: String,
      required: requireIfLocal,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: requireIfLocal,
      select: false,
    },
    profilePicture: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["client", "designer", "admin"],
      default: "client",
      required: true,
    },
    emailVerifiedAt:{
      type : Date,
      default : null
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpire: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    refreshTokens: [
      {
        token: { type: String, select: false },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true, index: true },
      },
    ],
  },
  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
