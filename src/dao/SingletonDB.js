import mongoose from "mongoose";
import { logger } from "../utils/index.js";

export class Singleton {
  static #connection;
  constructor(url, db) {
    mongoose.connect(url, { dbName: db });
  }

  static connect(url, db) {
    if (this.#connection) {
      logger.info("The connection has already been established");
      return this.#connection;
    }

    this.#connection = new Singleton(url, db);
    logger.info("DB connected");
    return this.#connection;
  }
}
