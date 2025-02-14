import { Router } from "express";
import {
  authoriseGuard,
  listUnauthorisedGuards,
} from "../controllers/admin.controller.js";
import { verifyJWTuser } from "../middleware/auth.middleware.js";

const router = Router();

// Route to authorise a guard
router.patch("/authorise/:guardId", verifyJWTuser, authoriseGuard);

// Route to list unauthorised guards
router.get("/unauthorised", verifyJWTuser, listUnauthorisedGuards);

export default router;
