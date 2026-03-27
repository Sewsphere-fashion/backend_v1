// services/UserService.js
import User from "./user.model.js";
import AppError from "../errorHandlers/appError.js";
import Guards from "../guards/guards.js";
import crypto from "crypto";
import Labels from "../utils/labels.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../helpers/email.js";
// import EmailHelper from "../helpers/emailHelper.js";

class UserService {
  static register = async (userData) => {
    const { firstName, lastName, email, password, role } = userData;

    // Allowed roles
    const allowedRoles = ["client", "designer"];
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      Labels.serviceLog.warn(`${email} already exists`, { email });
      throw new AppError("Email already exists", 409);
    }

    // Validate role
    if (role && !allowedRoles.includes(role)) {
      Labels.serviceLog.warn("Invalid role selected", { email, role });
      throw new AppError("Invalid role selected", 400);
    }

    // Hash password
    const hashedPassword = await Guards.hashPassword(password);

    // Generate email verification token — store hashed, send raw
    const rawEmailToken = crypto.randomBytes(32).toString("hex");
    const hashedEmailToken = crypto
      .createHash("sha256")
      .update(rawEmailToken)
      .digest("hex");

    const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

    // Create user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      role: role || "client",
      password: hashedPassword,
      emailVerificationToken: hashedEmailToken,
      emailVerificationExpire,
    });

    Labels.serviceLog.info(`User registered: ${email}`, {
      email,
      role: user.role,
    });

    // Fire-and-forget verification email
    const sendEmail = async () => {
      try {
        await sendVerificationEmail(user.email, rawEmailToken);
        Labels.serviceLog.info(`Verification email sent to ${email}`, {
          email,
        });
      } catch (err) {
        Labels.serviceLog.error(
          `Failed to send verification email to ${email}`,
          { email, error: err },
        );
      }
    };
    sendEmail();

    // Return safe user object and allowed roles
    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      allowedRoles,
      message:
        "Registration successful! Please check your email to verify your account.",
    };
  };

  static verifyEmail = async (token) => {
    if (!token) throw new AppError("Verification token is required", 400);

    //  Must hash the raw token to match what's stored in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) throw new AppError("Invalid or expired verification token", 400);
    if (user.isVerified) throw new AppError("Email is already verified", 400);

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    Labels.serviceLog.info(`Email verified successfully for ${user.email}`, {
      email: user.email,
    });

    return { message: "Email verified successfully", user };
  };

  // login logic
  static login = async (userData) => {
    const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
    const MAX_SESSIONS = 5;

    const { email, password } = userData;

    // Find user and validate credentials
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new AppError("Invalid email or password", 401);
    if (!user.isVerified)
      throw new AppError("Please verify your email before logging in", 403);

    const isPasswordCorrect = await Guards.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new AppError("Invalid email or password", 401);

    // Generate tokens
    const accessToken = Guards.createAccessToken(user);
    const { refreshToken, hashedToken } = Guards.createRefreshToken();
    const refreshTokenExpiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRY_MS,
    );

    // Prune expired tokens, enforce session cap, then add new token
    const now = new Date();
    const activeSessions = user.refreshTokens.filter((t) => t.expiresAt > now);
    // drop oldest
    if (activeSessions.length >= MAX_SESSIONS) activeSessions.shift(); 

    user.refreshTokens = [
      ...activeSessions,
      { token: hashedToken, expiresAt: refreshTokenExpiresAt },
    ];
    await user.save();

    return {
      accessToken,
      refreshToken,
      expiresAt: refreshTokenExpiresAt,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  };

  // send forgot password
  static forgotPassword = async (email) => {
    if (!email) throw new AppError("Email is required", 400);

    const user = await User.findOne({ email });

    // Always return same response — prevent email enumeration
    if (!user)
      return { message: "We'll send a reset link if that account exists" };

    // Generate reset token — same pattern as email verification
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(rawResetToken)
      .digest("hex");
    const resetPasswordExpires = Date.now() + 1 * 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send raw token in email
    await sendResetPasswordEmail(user.email, rawResetToken);

    Labels.serviceLog.info(`Password reset email sent to ${email}`, { email });

    return { message: "If that email exists, a reset link has been sent" };
  };

  // reset password
  static resetPassword = async (token, newPassword) => {
    if (!token) throw new AppError("Reset token is required", 400);
  
    // Hash incoming token to match DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new AppError("Invalid or expired reset token", 400);

    // Update password and clear reset token
    user.password = await Guards.hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    Labels.serviceLog.info(`Password reset successful for ${user.email}`, {
      email: user.email,
    });

    return {
      message: "Password reset successful, please login with your new password",
    };
  };

  static changePassword = async (userId, currentPassword, newPassword) => {
    // Find user and include password field
    const user = await User.findById(userId).select("+password");
    if (!user) throw new AppError("User not found", 404);

    // Verify current password is correct
    const isPasswordCorrect = await Guards.comparePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new AppError("Current password is incorrect", 401);

    // Make sure new password is different from current
    const isSamePassword = await Guards.comparePassword(
      newPassword,
      user.password,
    );
    if (isSamePassword)
      throw new AppError(
        "New password must be different from current password",
        400,
      );

    // Update password
    user.password = await Guards.hashPassword(newPassword);
    user.passwordChangedAt = Date.now();
    await user.save();

    Labels.serviceLog.info(`Password changed successfully for ${user.email}`, {
      email: user.email,
    });

    return { message: "Password changed successfully, please login again" };
  };

  static resendVerification = async (email) => {
    if (!email) throw new AppError("Email is required", 400);

    const user = await User.findOne({ email });

    if (!user)
      return {
        message: "If that email exists, a new verification link has been sent",
      };

    if (user.isVerified) throw new AppError("Email is already verified", 400);

    const rawEmailToken = crypto.randomBytes(32).toString("hex");
    const hashedEmailToken = crypto
      .createHash("sha256")
      .update(rawEmailToken)
      .digest("hex");

    user.emailVerificationToken = hashedEmailToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user.email, rawEmailToken);

    Labels.serviceLog.info(`Verification email resent to ${email}`, { email });

    return {
      message: "If that email exists, a new verification link has been sent",
    };
  };
}

export default UserService;
