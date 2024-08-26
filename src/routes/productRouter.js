import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { ProductController } from "../controller/ProductController.js";
export const router = Router();

router.get("/", ProductController.getProducts);

router.get("/:pid", ProductController.getProductById);

router.post("/", auth(["admin"]), ProductController.addProduct);

router.put("/:pid", auth(["admin"]), ProductController.updateProduct);

router.delete(
  "/:pid",
  auth(["admin", "premium"]),
  ProductController.deleteProduct
);
