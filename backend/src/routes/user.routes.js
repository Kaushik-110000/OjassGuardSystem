import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAccessToken,
  getCurrentUser,
  checkRefreshToken,
  getUser,
  authoriseGuard,
} from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWTuser } from "../middleware/auth.middleware.js";

const router = Router();

// Register new user (with avatar upload)
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);

// Login
router.post("/login", loginUser);

// Logout (protected route)
router.post("/logout", verifyJWTuser, logoutUser);

// Refresh tokens
router.post("/refresh-tokens", getAccessToken);

// Get current logged-in user (protected route)
router.get("/current-user", verifyJWTuser, getCurrentUser);

// Check if refresh token exists
router.get("/check-refresh", checkRefreshToken);

// Get user by username
router.get("/:userName", getUser);

router.post("/reqAuth/:guardId",verifyJWTuser, authoriseGuard);

export default router;
