// services/UserService.js
import User from "./user.model.js";
import AppError from "../errorHandlers/appError.js";
import Guards from "../guards/guards.js";
import crypto from "crypto";
import Labels from "../utils/labels.js";
import { sendVerificationEmail } from "../helpers/email.js";
// import EmailHelper from "../helpers/emailHelper.js";

class UserService {
  static register = async (userData) => {
    const { firstName, lastName, email, password, role } = userData;

    // Allowed roles
    const allowedRoles = ["client", "designer"];

    //  Check if user already exists
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
      console.log("=== REGISTRATION ===");
console.log("RAW token:", rawEmailToken);
console.log("HASHED token stored in DB:", hashedEmailToken);
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
        console.log(err);
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
    const { email, password } = userData;

    //Find user by email and explicitly include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        Labels.serviceLog.warn(`Login failed - email not found`, { email });
        throw new AppError("Invalid email or password", 401);
    }

    // Check if email is verified
    if (!user.isVerified) {
        Labels.serviceLog.warn(`Login failed - email not verified`, { email });
        throw new AppError("Please verify your email before logging in", 403);
    }

    //  Compare password
    const isPasswordCorrect = await Guards.comparePassword(password, user.password);
    if (!isPasswordCorrect) {
        Labels.serviceLog.warn(`Login failed - incorrect password`, { email });
        throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = Guards.createJwt({ id: user._id, role: user.role,email:user.email });

    Labels.serviceLog.info(`User logged in successfully`, { email, role: user.role });

    //  Return safe user object and token
    return {
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        }
    };
};

// send forgot password
static forgotPassword = async (email) => {
    if (!email) throw new AppError("Email is required", 400);

    const user = await User.findOne({ email });

    // Always return same response — prevent email enumeration
    if (!user) return { message: "If that email exists, a reset link has been sent" };

    // Generate reset token — same pattern as email verification
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");
    const resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

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
    if (!newPassword) throw new AppError("New password is required", 400);

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

    Labels.serviceLog.info(`Password reset successful for ${email}`, { email: user.email });

    return { message: "Password reset successful, please login with your new password" };
  };

  static resendVerification = async (email) => {
  if (!email) throw new AppError("Email is required", 400);

  const user = await User.findOne({ email });

  // Don't reveal if email exists or not
  if (!user) return { message: "If that email exists, a new verification link has been sent" };

  // If already verified no need to resend
  if (user.isVerified) throw new AppError("Email is already verified", 400);

  // Generate new token — same pattern
  const rawEmailToken = crypto.randomBytes(32).toString("hex");
  const hashedEmailToken = crypto.createHash("sha256").update(rawEmailToken).digest("hex");

  user.emailVerificationToken = hashedEmailToken;
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  await sendVerificationEmail(user.email, rawEmailToken);

  Labels.serviceLog.info(`Verification email resent to ${email}`, { email });

  return { message: "If that email exists, a new verification link has been sent" };
};
}

export default UserService;
