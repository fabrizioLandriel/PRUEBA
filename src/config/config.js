import dotenv from "dotenv";
import __dirname from "../dirname.js";

dotenv.config({ path: `${__dirname}/.env`, override: true });

export const config = {
  PORT: process.env.PORT || 3000,
  PERSISTENCE: process.env.PERSISTENCE,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  SECRET: process.env.SECRET,
  CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
  CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
  PASSWORD_GMAIL_NODEMAILER: process.env.PASSWORD_GMAIL_NODEMAILER,
  USER_GMAIL_NODEMAILER: process.env.USER_GMAIL_NODEMAILER,
  MODE: process.env.MODE,
  EMAIL_ADMIN: process.env.EMAIL_ADMIN,
  PASSWORD_ADMIN: process.env.PASSWORD_ADMIN,
  EMAIL_PREMIUM: process.env.EMAIL_PREMIUM,
  PASSWORD_PREMIUM: process.env.PASSWORD_PREMIUM,
  URL: process.env.URL,
};

//
// _id
// 6634f9c260dc796de83d6d58
// title
// "Razer BlackWidow V3 Pro"
// description
// "Teclado mecánico inalámbrico con retroiluminación RGB."
// code
// "tec1"
// price
// 250
// status
// true
// stock
// 86
// category
// "teclados"

// thumbnails
// Array (2)
// __v
// 0
// owner
// "molinavitillo@gmail.com"
