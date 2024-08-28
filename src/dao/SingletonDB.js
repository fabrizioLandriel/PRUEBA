import mongoose from "mongoose";
import { logger } from "../utils/index.js";

export class Singleton {
  static #connection;
  constructor(url, db) {
    mongoose.connect(url, { dbName: db });
  }

  static connect(url, db) {
    if (this.#connection) {
      logger.info("La conexion ya fue establecida");
      return this.#connection;
    }

    this.#connection = new Singleton(url, db);
    logger.info("Db conectada");
    return this.#connection;
  }
}
