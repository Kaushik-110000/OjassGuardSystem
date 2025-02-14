import { Router } from "express";
import {
  getCoordinates,
  assignLocation,
} from "../controllers/location.controller.js";
const router = Router();

router.post("/getCoordinates", getCoordinates);
router.post("/assign", assignLocation);
export default router;
