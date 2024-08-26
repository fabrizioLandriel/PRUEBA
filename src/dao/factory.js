import { config } from "../config/config.js";
import { Singleton } from "./SingletonDB.js";

export let productDAO;
export let cartDAO;
export let userDAO;
export let ticketDAO;

switch (config.PERSISTENCE.toUpperCase()) {
  case "FS":
    const productFsDAO = await import("./ProductManagerFileSystem.js");
    productDAO = productFsDAO.ProductManager;
    const cartFsDAO = await import("./CartManagerFileSystem.js");
    cartDAO = cartFsDAO.CartManager;
    break;

  case "MONGO":
    Singleton.connect(config.MONGO_URL, config.DB_NAME);

    const productMongoDAO = await import("./ProductMongoDAO.js");
    productDAO = productMongoDAO.ProductManagerMongoDAO;

    const cartMongoDAO = await import("./CartMongoDAO.js");
    cartDAO = cartMongoDAO.CartManagerMongoDAO;

    const userMongoDAO = await import("./UserMongoDAO.js");
    userDAO = userMongoDAO.UserManagerMongoDAO;

    const ticketMongoDAO = await import("./TicketMongoDAO.js");
    ticketDAO = ticketMongoDAO.TicketMongoDAO;

    break;

  default:
    throw new Error("Misconfigured persistence");
    break;
}
