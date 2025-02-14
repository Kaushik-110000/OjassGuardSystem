import { Router } from "express";
import { getCoordinates } from "../controllers/location.controller.js";
const router = Router();

router.post("/getCoordinates", getCoordinates);

export default router;
