import { userDAO } from "../dao/factory.js";

class UserService {
  constructor(dao) {
    this.dao = new dao();
  }

  async createUser(user) {
    return await this.dao.create(user);
  }

  async getUserBy(filter) {
    return await this.dao.getBy(filter);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

export const userService = new UserService(userDAO);