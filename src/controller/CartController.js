import { cartService } from "../services/cartsService.js";
import { isValidObjectId } from "mongoose";
import { ticketService } from "../services/ticketsService.js";
import { CustomError } from "../utils/CustomError.js";
import { ERROR_TYPES } from "../utils/EErrors.js";
import { productService } from "../services/productsService.js";

export class CartController {
  static getAllCarts = async (req, res, next) => {
    try {
      try {
        let getAllCarts = await cartService.getAllCarts();
        return res.json({ getAllCarts });
      } catch (error) {
        return CustomError.createError(
          "ERROR",
          null,
          "Carts not found",
          ERROR_TYPES.NOT_FOUND
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static createCart = async (req, res, next) => {
    try {
      try {
        let cart = await cartService.createCart();
        return res.json({
          payload: `Cart created`,
          cart,
        });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static getCartById = async (req, res, next) => {
    try {
      let { cid } = req.params;
      if (!isValidObjectId(cid)) {
        CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        let cartById = await cartService.getCartById(cid);
        if (!cartById) {
          return CustomError.createError(
            "ERROR",
            null,
            "Cart not found",
            ERROR_TYPES.NOT_FOUND
          );
        } else {
          res.json({ cartById });
        }
      } catch (error) {
        return CustomError.createError(
          "ERROR",
          null,
          "Internal server error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static addProductToCart = async (req, res, next) => {
    try {
      let { cid, pid } = req.params;

      if (!isValidObjectId(cid, pid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      if (!cid || !pid) {
        return CustomError.createError(
          "Unfilled fields",
          null,
          "Check unfilled fields",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }
      let product = await productService.getProductsBy({ _id: pid });
      if (!product) {
        return CustomError.createError(
          "ERROR",
          null,
          "Product not found",
          ERROR_TYPES.NOT_FOUND
        );
      }
      const userRole = req.session.user.role.toLowerCase();
      const userEmail = req.session.user.email;
      if (userRole.toLowerCase() == "premium") {
        if (product.owner == userEmail) {
          return CustomError.createError(
            "Premium User Restriction",
            null,
            "Premium users cannot add their own products to the cart",
            ERROR_TYPES.UNAUTHORIZED
          );
        }
      }

      try {
        await cartService.addProductToCart(cid, pid);
        let cartUpdated = await cartService.getCartById(cid);
        res.json({ payload: cartUpdated });
      } catch (error) {
        return CustomError.createError(
          "ERROR",
          null,
          "Internal server error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static deleteProductInCart = async (req, res, next) => {
    try {
      let { cid, pid } = req.params;
      if (!isValidObjectId(cid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      if (!cid || !pid) {
        return CustomError.createError(
          "Unfilled fields",
          null,
          "Check unfilled fields",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        let cart = await cartService.getCartById(cid);
        if (cart.products.length === 0) {
          return CustomError.createError(
            "ERROR",
            null,
            "No products in the cart",
            ERROR_TYPES.NOT_FOUND
          );
        }
        for (const product of cart.products) {
          const productDetails = await productService.getProductsBy({
            _id: pid,
          });
          if (!productDetails) {
            return CustomError.createError(
              "ERROR",
              null,
              "Product not found",
              ERROR_TYPES.NOT_FOUND
            );
          }
        }

        await cartService.deleteProductInCart(cid, pid);
        return res.json({ payload: `Product ${pid} deleted from cart ${cid}` });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          `Internal server Error, ${error.message}`,
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static updateProductInCart = async (req, res, next) => {
    try {
      let { cid, pid } = req.params;
      let { quantity } = req.body;
      if (!isValidObjectId(cid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      if (!cid || !pid) {
        return CustomError.createError(
          "Unfilled fields",
          null,
          "Check unfilled fields",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        let cart = await cartService.getCartById(cid);
        if (cart.products.length === 0) {
          return CustomError.createError(
            "ERROR",
            null,
            "No products in the cart",
            ERROR_TYPES.NOT_FOUND
          );
        }
        for (const product of cart.products) {
          const productDetails = await productService.getProductsBy({
            _id: pid,
          });
          if (!productDetails) {
            return CustomError.createError(
              "ERROR",
              null,
              "Product not found",
              ERROR_TYPES.NOT_FOUND
            );
          }
        }
        await cartService.updateProductInCart(cid, pid, quantity);
        let cartUpdated = await cartService.getCartById(cid);
        res.json({ payload: `Product ${pid} updated`, cartUpdated });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          `Internal server Error, ${error.message}`,
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static deleteAllProductsInCart = async (req, res, next) => {
    try {
      let { cid } = req.params;
      if (!isValidObjectId(cid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      if (!cid) {
        return CustomError.createError(
          "Unfilled fields",
          null,
          "Check unfilled fields",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        await cartService.deleteAllProductsInCart(cid);
        res.json({ payload: `Products deleted from cart ${cid}` });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static updateAllCart = async (req, res, next) => {
    try {
      let { cid } = req.params;
      let toUpdate = req.body;
      if (!isValidObjectId(cid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      if (!cid) {
        return CustomError.createError(
          "Unfilled fields",
          null,
          "Invalid cart",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      if (!toUpdate.product || !toUpdate.quantity) {
        return CustomError.createError(
          "ERROR",
          null,
          "Invalid cart",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        await cartService.updateAllCart(cid, toUpdate);
        let cartUpdated = await cartService.getCartById(cid);
        res.json({ payload: `Cart ${cid} updated`, cartUpdated });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          null,
          5
        )
      );
      next(error);
    }
  };

  static createTicket = async (req, res, next) => {
    try {
      let { cid } = req.params;
      let purchaser = req.session.user.email;
      if (!isValidObjectId(cid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        let ticket = await ticketService.generateTicket(cid, purchaser);
        res.json({ ticket });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };
}
