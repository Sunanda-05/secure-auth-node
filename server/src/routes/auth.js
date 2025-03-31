import { request, Router } from "express";
import rateLimit from "express-rate-limit";
import {
  enable2FAFunction,
  loginUser,
  logoutUser,
  refreshTokens,
} from "../controllers/auth.controller.js";
import { registerUser } from "../controllers/resgister.controller.js";
import { resetPassword } from "../controllers/passwordReset.controller.js";
import { requestReset } from "../controllers/passwordReset.controller.js";

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
router.post("/reset-password", resetPassword);
router.post("/request-reset", requestReset);
router.post("/enable-2fa", enable2FAFunction);

export default router;
