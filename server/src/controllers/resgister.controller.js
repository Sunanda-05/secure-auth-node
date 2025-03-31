import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../models/user.model.js";

export const registerUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({ error: "Invalid email format." });
    }

    if (password.length < 6) {
      return response
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return response
        .status(400)
        .json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(email, hashedPassword);

    return response
      .status(201)
      .json({ message: "User registered successfully!", userId });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};
