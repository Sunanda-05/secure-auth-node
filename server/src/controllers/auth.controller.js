import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getUserByEmail,
  updateFailedAttempts,
  lockUserAccount,
  unlockUserAccount,
  enable2FA,
  getUserOTPSecret
} from "../models/user.model.js";
import {
  deleteRefreshToken,
  getRefreshToken,
} from "../models/refreshToken.model.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000;

export const loginUser = async (request, response) => {
  try {
    const { email, password, otpToken } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return response.status(404).json({ error: "Email is not registered." });
    }

    console.log({ user });
    if (
      user.isLocked &&
      user.locked_until &&
      new Date(user.locked_until) > new Date()
    ) {
      return response
        .status(403)
        .json({ error: "Account is temporarily locked. Try again later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await updateFailedAttempts(email, user.failedAttempts + 1);

      if (user.failedAttempts + 1 >= MAX_ATTEMPTS) {
        await lockUserAccount(email, LOCK_DURATION);
        return response
          .status(403)
          .json({ error: "Too many failed attempts. Account locked." });
      }

      return response.status(401).json({ error: "Wrong password." });
    }

    // If 2FA is enabled, require OTP code
    if (user.is2FAEnabled) {
      if (!otpToken) {
        return response
          .status(400)
          .json({ message: "Enter your 2FA code", requires2FA: true });
      }

      // Verify OTP Token
      const userSecret = await getUserOTPSecret(email);
      const isValidOTP = speakeasy.totp.verify({
        secret: userSecret.otpSecret,
        encoding: "base32",
        token: otpToken,
        window: 1, // Accept slightly old/new codes
      });

      if (!isValidOTP)
        return response.status(401).json({ error: "Invalid 2FA code" });
    }

    await updateFailedAttempts(email, 0);
    await unlockUserAccount(email);

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents XSS (JavaScript cannot access it)
      secure: false, // Only send over HTTPS     //make to true when https
      sameSite: "Lax", // Prevents most CSRF attacks
      path: "/auth/refresh-token", // Restrict usage to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response.status(200).json({
      message: "Login successful!",
      email,
      accessToken,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const refreshTokens = async (request, response) => {
  try {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken)
      return response.status(401).json({ error: "No refresh token provided." });

    const dbToken = getRefreshToken(refreshToken);
    if (!dbToken) {
      return response.status(401).json({ error: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return response
          .status(403)
          .json({ error: "Expired or invalid refresh token" });

      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return response.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const logoutUser = async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    await deleteRefreshToken(refreshToken);

    response.clearCookie("refreshToken");
    return response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const enable2FAFunction = async (request, response) => {
  try {
    const { email } = request.body;
    const secret = speakeasy.generateSecret({ length: 20 });
    await enable2FA(email, secret.base32);

    // QR code for Google Authenticator
    const otpAuthUrl = `otpauth://totp/AuthLite:${email}?secret=${secret.base32}&issuer=AuthLite`;

    QRCode.toDataURL(otpAuthUrl, (err, dataUrl) => {
      if (err)
        return response.status(500).json({ error: "Failed to generate QR code" });

      response.json({ qrCode: dataUrl, secret: secret.base32 });
    });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};
