import { generateResetToken, resetPassword } from "../utils/resetPassword.js";
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

export const resetPasswordFunction = async (request, response) => {
  const { token, newPassword } = request.body;

  try {
    await resetPassword(token, newPassword);
    response.json({ message: "Password successfully reset" });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
