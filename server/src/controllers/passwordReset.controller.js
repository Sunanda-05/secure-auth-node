import bcrypt from "bcryptjs";
import {
  getPasswordResetToken,
  deletePasswordResetToken,
} from "../models/passwordReset.model.js";
import { updatePassword } from "../models/user.model.js";
import { generateResetToken } from "../utils/resetPassword.js";
import { sendPasswordResetEmail } from "../utils/nodemailerUtil.js";
import { getUserByEmail } from "../models/user.model.js";

export const requestReset = async (request, response) => {
  const { email } = request.body;

  const user = await getUserByEmail(email);
  if (!user) return response.status(400).json({ message: "User not found" });

  const token = await generateResetToken(user.id);
  await sendPasswordResetEmail(email, token);

  response.json({ message: "Password reset email sent" });
};

export const resetPassword = async (request, response) => {
  const { token, newPassword } = request.body;

  try {
    const tokenData = await getPasswordResetToken(token);

    if (!tokenData || tokenData.expiresAt < Date.now()) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(tokenData.userId, hashedPassword);

    await deletePasswordResetToken(token);
    response.json({ message: "Password successfully reset" });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
