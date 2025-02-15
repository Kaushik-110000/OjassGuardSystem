import { Router } from "express";
import {
  addLive,
  updateLive,
  listLiveGuards,
} from "../controllers/liveloc.controller.js";
import { verifyJWTguard } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/addlive").post(verifyJWTguard, addLive);
router.route("/updatelive").patch(verifyJWTguard, updateLive);
router.route("/liveList").get(listLiveGuards);
export default router;
