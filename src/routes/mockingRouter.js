import { Router } from "express";
import { MockingController } from "../controller/mockingController.js";
export const router = Router();

router.get("/", MockingController.generateProducts);
