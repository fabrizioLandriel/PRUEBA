import { Router } from "express";
import { logger } from "../utils/index.js";
export const router = Router();

router.get("/", (req, res) => {
  logger.fatal("Fatal log message");
  logger.error("Error log message");
  logger.warning("Warning log message");
  logger.info("Info log message");
  logger.http("HTTP log message");
  logger.debug("Debug log message");

  return res.json({ message: "Logs generated successfully" });
});
