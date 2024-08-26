import { cartDAO } from "../dao/factory.js";

class CartService {
  constructor(dao) {
    this.dao = new dao();
  }

  async createCart() {
    return await this.dao.create();
  }

  async getAllCarts() {
    return await this.dao.get();
  }

  async getCartById(idCart) {
    return await this.dao.getById(idCart);
  }

  async addProductToCart(idCart, idProduct) {
    return await this.dao.add(idCart, idProduct);
  }

  async deleteProductInCart(idCart, idProduct) {
    return await this.dao.delete(idCart, idProduct);
  }

  async updateProductInCart(idCart, idProduct, quantityUpdate) {
    return await this.dao.update(idCart, idProduct, quantityUpdate);
  }

  async deleteAllProductsInCart(idCart) {
    return await this.dao.deleteAll(idCart);
  }

  async updateAllCart(idCart, toUpdate) {
    return await this.dao.updateAll(idCart, toUpdate);
  }
}

export const cartService = new CartService(cartDAO);
