import bcrypt from "bcryptjs";
import crypto from "crypto";
import { storePasswordResetToken } from "../models/passwordReset.model.js";
import {
  getPasswordResetToken,
  deletePasswordResetToken,
} from "../models/passwordReset.model.js";
import { updatePassword } from "../models/user.model.js";

export const resetPassword = async (token, newPassword) => {
  const tokenData = await getPasswordResetToken(token);

  if (!tokenData || tokenData.expiresAt < Date.now()) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updatePassword(tokenData.userId, hashedPassword);

  await deletePasswordResetToken(token);
};

export const generateResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 3600000; // 1 hour expiry

  await storePasswordResetToken(userId, token, expiresAt);
  return token;
};
