import { Router } from "express";
import {
  requestPasswordReset,
  sendPasswordResetEmail,
  resetPassword,
  updatePassword,
} from "../controller/passwordResetController.js";

export const router = Router();

router.get("/request-password-reset", requestPasswordReset);
router.post("/request-password-reset", sendPasswordResetEmail);
router.get("/reset/:token", resetPassword);
router.post("/reset/:token", updatePassword);
