import { Router } from "express";
import { CartController } from "../controller/CartController.js";
import { auth } from "../middlewares/auth.js";
export const router = Router();

router.get("/", CartController.getAllCarts);

router.post("/", CartController.createCart);

router.get("/:cid", CartController.getCartById);

router.post(
  "/:cid/product/:pid",
  auth(["user", "premium"]),
  CartController.addProductToCart
);

router.delete("/:cid/product/:pid", CartController.deleteProductInCart);

router.put("/:cid/product/:pid", CartController.updateProductInCart);

router.delete("/:cid", CartController.deleteAllProductsInCart);

router.put("/:cid", CartController.updateAllCart);

router.post("/:cid/purchase", CartController.createTicket);
