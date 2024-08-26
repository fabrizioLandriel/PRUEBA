import mongoose, { isValidObjectId } from "mongoose";
import { after, afterEach, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { fakerEN_US as faker } from "@faker-js/faker";
import { config } from "../src/config/config.js";

const requester = supertest("http://localhost:8081");
let user = { email: config.EMAIL_ADMIN, password: config.PASSWORD_ADMIN };
let mockProduct = {
  title: "test",
  description: "product test",
  code: faker.string.alphanumeric(4),
  price: faker.commerce.price({ min: 10, max: 500 }),
  status: true,
  stock: faker.number.int({ min: 1, max: 100 }),
  category: faker.commerce.productAdjective(),
  thumbnails: [faker.image.url()],
  owner: user.email,
};

describe("Product router test", function () {
  this.timeout(10000);
  before(async function () {
    await requester.post("/api/sessions/login").send(user);
  });

  afterEach(async function () {
    await mongoose.connection
      .collection("products")
      .deleteMany({ title: "test" });
  });

  after(async function () {
    await requester.get("/api/sessions/logout");
  });

  it("Get all products", async function () {
    let response = await requester.get("/api/products");
    let { ok, status, body } = response;
    expect(body.status).to.be.equal("success");
    expect(Array.isArray(body.payload)).to.be.true;
    expect(body.payload[0]).to.have.property("_id");
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Get products by id", async function () {
    let productRes = await requester.post("/api/products").send(mockProduct);
    let pid = productRes.body.product._id;
    let response = await requester.get(`/api/products/${pid}`);
    let { ok, status, body } = response;
    expect(isValidObjectId(body.product._id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Add product to DB", async function () {
    let response = await requester.post("/api/products").send(mockProduct);
    let { ok, status, body } = response;
    expect(body.payload).to.be.equal("Product added");
    expect(isValidObjectId(body.product._id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Update product", async function () {
    let productRes = await requester.post("/api/products").send(mockProduct);
    let pid = productRes.body.product._id;
    let response = await requester
      .put(`/api/products/${pid}`)
      .send({ stock: 200 });
    let { ok, status, body } = response;
    expect(isValidObjectId(body._id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.stock).not.to.be.equal(productRes.body.product.stock);
  });

  it("Delete product", async function () {
    let productRes = await requester.post("/api/products").send(mockProduct);

    let pid = productRes.body.product._id;
    let response = await requester.delete(`/api/products/${pid}`);
    let { ok, status, body } = response;
    expect(isValidObjectId(pid)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.payload).to.be.equal(`Product ${pid} deleted`);
  });
});
