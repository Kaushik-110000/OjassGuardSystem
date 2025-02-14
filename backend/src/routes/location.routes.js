import { Router } from "express";
import {
  getCoordinates,
  assignLocation,
  unassignTheGuard,
  getALocation,
} from "../controllers/location.controller.js";
const router = Router();

router.post("/getCoordinates", getCoordinates);
router.post("/assign", assignLocation);
router.post("/unassignTheGuard/:assignMentId", unassignTheGuard);
router.get("/getAssignment/:locationId", getALocation);
export default router;
