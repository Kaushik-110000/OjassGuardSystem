import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAccessToken,
  getCurrentUser,
  checkRefreshToken,
  getUser,
} from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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
router.post("/logout", verifyJWT, logoutUser);

// Refresh tokens
router.post("/refresh-tokens", getAccessToken);

// Get current logged-in user (protected route)
router.get("/current-user", verifyJWT, getCurrentUser);

// Check if refresh token exists
router.get("/check-refresh", checkRefreshToken);

// Get user by username
router.get("/:userName", getUser);

export default router;
