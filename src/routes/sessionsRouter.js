import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/passportCall.js";
import { SessionsController } from "../controller/sessionsController.js";

export const router = Router();

router.post("/register", passportCall("register"), SessionsController.register);
router.post("/login", passportCall("login"), SessionsController.login);
router.get("/github", passport.authenticate("github", {}), (req, res) => {});
router.get(
  "/githubCallback",
  passportCall("github"),
  SessionsController.githubCallback
);
router.get("/current", SessionsController.current);
router.post("/logout", SessionsController.logout);
