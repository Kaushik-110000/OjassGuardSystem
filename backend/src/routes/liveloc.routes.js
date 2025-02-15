import { Router } from "express";
import { addLive, updateLive } from "../controllers/liveloc.controller.js";
import { verifyJWTguard } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/addlive").post(verifyJWTguard, addLive);
router.route("/updatelive").patch(verifyJWTguard, updateLive);

export default router;
