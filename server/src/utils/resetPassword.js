import crypto from "crypto";
import { storePasswordResetToken } from "../models/passwordReset.model.js";

export const generateResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 3600000; // 1 hour expiry

  await storePasswordResetToken(userId, token, expiresAt);
  return token;
};
