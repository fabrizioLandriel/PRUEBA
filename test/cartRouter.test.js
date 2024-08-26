import { isValidObjectId } from "mongoose";
import { after, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { fakerEN_US as faker } from "@faker-js/faker";
import { productsModel } from "../src/dao/models/productsModel.js";
import { Singleton } from "../src/dao/SingletonDB.js";
import { config } from "../src/config/config.js";
import { cartsModel } from "../src/dao/models/cartsModel.js";

let mockProduct = {
  title: "test",
  description: "product test",
  code: faker.string.alphanumeric(4),
  price: faker.commerce.price({ min: 10, max: 500 }),
  status: true,
  stock: faker.number.int({ min: 1, max: 100 }),
  category: faker.commerce.productAdjective(),
  thumbnails: [faker.image.url()],
};
let premium = {
  email: config.EMAIL_PREMIUM,
  password: config.PASSWORD_PREMIUM,
};
let user = { email: config.EMAIL_ADMIN, password: config.PASSWORD_ADMIN };

const requester = supertest("http://localhost:8081");
describe("Cart router test", function () {
  this.timeout(10000);
  before(async function () {
    Singleton.connect(config.MONGO_URL, config.DB_NAME);
    await requester.post("/api/sessions/login").send(user);
  });

  after(async function () {
    await requester.get("/api/sessions/logout");
  });

  it("Get all carts", async function () {
    let response = await requester.get("/api/carts");
    let { ok, status, body } = response;
    expect(Array.isArray(body.getAllCarts)).to.be.true;
    expect(body.getAllCarts[0]).to.have.property("_id");
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Create cart", async function () {
    let response = await requester.post("/api/carts");
    let { ok, status, body } = response;
    expect(body.payload).to.be.equal("Cart created");
    expect(body.cart).to.have.property("_id");
    expect(Array.isArray(body.cart.products)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    await cartsModel.findByIdAndDelete(body.cart._id);
  });

  it("Get cart by id", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart.body.cart._id;
    let response = await requester.get(`/api/carts/${cid}`);
    let { ok, status, body } = response;
    expect(body.cartById).to.have.property("_id");
    expect(Array.isArray(body.cartById.products)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await cartsModel.findByIdAndDelete(cid);
  });

  it("Add product to cart", async function () {
    await requester.post("/api/sessions/login").send(premium);
    let cart = await requester.post("/api/carts");
    let cid = cart.body.cart._id;
    let product = await productsModel.create(mockProduct);
    let pid = product._id;
    let response = await requester.post(`/api/carts/${cid}/product/${pid}`);
    let { ok, status, body } = response;
    expect(body.payload).to.have.property("_id");
    expect(Array.isArray(body.payload.products)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productsModel.findByIdAndDelete(pid);
    await cartsModel.findByIdAndDelete(cid);
  });

  it("Delete product in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart.body.cart._id;
    let product = await productsModel.create(mockProduct);
    let pid = product._id;
    await requester.post(`/api/carts/${cid}/product/${pid}`);
    let response = await requester.delete(`/api/carts/${cid}/product/${pid}`);
    let { ok, status, body } = response;
    expect(body.payload).to.be.equal(`Product ${pid} deleted from cart ${cid}`);
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productsModel.findByIdAndDelete(pid);
    await cartsModel.findByIdAndDelete(cid);
  });

  it("Update one product in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart.body.cart._id;
    let product = await productsModel.create(mockProduct);
    let pid = product._id;
    let cartWithProduct = await requester.post(
      `/api/carts/${cid}/product/${pid}`
    );
    let response = await requester
      .put(`/api/carts/${cid}/product/${pid}`)
      .send({ quantity: 123 });
    let { ok, status, body } = response;
    expect(body.payload).to.be.equal(`Product ${pid} updated`);
    expect(body.cartUpdated.products[0].product.quantity).not.to.be.equal(
      cartWithProduct.body.payload.products[0].quantity
    );
    expect(body.cartUpdated.products[0].product).to.have.property("_id");
    expect(isValidObjectId(body.cartUpdated.products[0].product._id)).to.be
      .true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    await productsModel.findByIdAndDelete(pid);
    await cartsModel.findByIdAndDelete(cid);
  });
  it("Delete all products in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart.body.cart._id;
    let product = await productsModel.create(mockProduct);
    let pid = product._id;
    await requester.post(`/api/carts/${cid}/product/${pid}`);
    let response = await requester.delete(`/api/carts/${cid}`);
    let { ok, status, body } = response;
    expect(body.payload).to.be.equal(`Products deleted from cart ${cid}`);
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productsModel.findByIdAndDelete(pid);
    await cartsModel.findByIdAndDelete(cid);
  });

  it("Update all products in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart.body.cart._id;
    let product = await productsModel.create(mockProduct);
    let pid = product._id;
    let cartWithProduct = await requester.post(
      `/api/carts/${cid}/product/${pid}`
    );
    let response = await requester.put(`/api/carts/${cid}`).send({
      product: { _id: "6634f9c260dc796de83d6d5a" },
      quantity: 10,
    });
    let { ok, status, body } = response;
    expect(body.cartUpdated.products[0].product.code).not.to.be.equal(
      cartWithProduct.body.payload.products[0].code
    );
    expect(body.payload).to.be.equal(`Cart ${cid} updated`);
    expect(body.cartUpdated.products[0].product).to.have.property("_id");
    expect(isValidObjectId(body.cartUpdated.products[0].product._id)).to.be
      .true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productsModel.findByIdAndDelete(pid);
    await cartsModel.findByIdAndDelete(cid);
  });
});
