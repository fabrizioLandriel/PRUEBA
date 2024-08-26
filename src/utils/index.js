import bcrypt from "bcrypt";
import swaggerJsDoc from "swagger-jsdoc";
import winston from "winston";
import { config } from "../config/config.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import __dirname from "../dirname.js";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Api Backend",
      version: "1.0.0",
      description: "Ecommerce API documentation",
    },
  },
  apis: ["./src/docs/*.yaml"],
};

export const specs = swaggerJsDoc(options);

let customLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};
export const logger = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "./src/logs/errors.log",
      format: winston.format.combine(winston.format.timestamp()),
    }),
  ],
});

const consoleTransport = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize({
      colors: {
        fatal: "bold white redBG",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "magenta",
        debug: "green",
      },
    }),
    winston.format.simple()
  ),
});
if (config.MODE.toUpperCase() === "DEV") {
  logger.add(consoleTransport);
}

export const middLogger = (req, res, next) => {
  req.logger = logger;

  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    if (file.fieldname === "profile") {
      folder = "profiles";
    } else if (file.fieldname === "product") {
      folder = "products";
    } else {
      folder = "documents";
    }

    const userFolder = path.join(__dirname, "uploads", folder);
    fs.mkdirSync(userFolder, { recursive: true });
    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    if (file.fieldname == "document") {
      cb(
        null,
        req.body.documentType +
          "-" +
          file.fieldname +
          "-" +
          req.session.user.first_name +
          "-" +
          file.originalname
      );
    }
    cb(
      null,
      file.fieldname +
        "-" +
        req.session.user.first_name +
        "-" +
        file.originalname
    );
  },
});

export const upload = multer({ storage: storage });
