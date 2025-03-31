import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  loginUser,
  logoutUser,
  refreshTokens,
} from "../controllers/auth.controller.js";
import { registerUser } from "../controllers/resgister.controller.js";

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: { error: "Too many failed attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/register", registerUser);
router.post("/refresh-token", refreshTokens);

export default router;
