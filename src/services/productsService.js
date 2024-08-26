import { productDAO } from "../dao/factory.js";

class ProductService {
  constructor(dao) {
    this.dao = new dao();
  }

  async getProductsPaginate(limit = 10, page = 1, price, query) {
    return await this.dao.getPaginate(limit, page, price, query);
  }

  async getAllProducts() {
    return await this.dao.getAll();
  }

  async getProductsBy(filter) {
    return await this.dao.getBy(filter);
  }

  async addProduct({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
    owner,
  }) {
    return await this.dao.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      owner,
    });
  }

  async updateProduct(id, productData) {
    return await this.dao.update(id, productData);
  }

  async deleteProduct(productId) {
    return this.dao.delete(productId);
  }
}

export const productService = new ProductService(productDAO);
