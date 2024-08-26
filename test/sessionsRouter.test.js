import { isValidObjectId } from "mongoose";
import { afterEach, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { fakerEN_US as faker } from "@faker-js/faker";
import { usersModel } from "../src/dao/models/userModel.js";
import { config } from "../src/config/config.js";
let mockRegister = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 50 }),
  password: faker.internet.password(),
};

let user = { email: config.EMAIL_ADMIN, password: config.PASSWORD_ADMIN };

const requester = supertest("http://localhost:8081");
describe("Sessions router test", function () {
  before(async function () {
    await requester.post("/api/sessions/login").send(user);
  });
  afterEach(async function () {
    await usersModel.deleteMany({ first_name: mockRegister.first_name });
    await requester.get("/api/sessions/logout");
  });

  it("Register", async function () {
    let response = await requester
      .post("/api/sessions/register")
      .send(mockRegister);
    let { ok, status, body } = response;
    expect(status).to.be.equal(201);
    expect(ok).to.be.true;
    expect(body.payload).to.be.equal(`Successful registration`);
    expect(isValidObjectId(body.newUser._id)).to.be.true;
  });

  it("Login", async function () {
    let response = await requester.post("/api/sessions/login").send(user);
    let { ok, status, body } = response;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.payload).to.be.equal(`Successfull login`);
  });

  it("Current user", async function () {
    await requester.post("/api/sessions/login").send(user);
    let response = await requester.get("/api/sessions/current");
    let { ok, status, body } = response;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.user.email).to.be.equal(`${config.EMAIL_ADMIN}`);
  });
});
