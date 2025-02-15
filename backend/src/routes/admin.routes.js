import { Router } from "express";
import {
  authoriseGuard,
  listUnauthorisedGuards,
  rejectGuard,
  listComplain,
} from "../controllers/admin.controller.js";
import { verifyJWTuser } from "../middleware/auth.middleware.js";

const router = Router();

// Route to authorise a guard
router.patch("/authorise/:guardId", verifyJWTuser, authoriseGuard);

// Route to list unauthorised guards
router.get("/unauthorised", verifyJWTuser, listUnauthorisedGuards);
router.patch("/reject/:guardId", verifyJWTuser, rejectGuard);
router.get("/complains/:guardId", listComplain);
export default router;
