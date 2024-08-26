import { usersModel } from "../dao/models/userModel.js";
import { UserViewDTO } from "../dto/UsersDTO.js";
import { CustomError } from "../utils/CustomError.js";
import { ERROR_TYPES } from "../utils/EErrors.js";

export class SessionsController {
  static login = async (req, res, next) => {
    try {
      let { web } = req.body;
      let user = { ...req.user };
      delete user.password;
      req.session.user = user;
      let userConn = await usersModel.findOne({ _id: req.session.user._id });
      userConn.last_connection = "online";
      await userConn.save();
      if (web == "web") {
        res.redirect("/");
      } else {
        return res.json({ payload: "Successfull login" });
      }
    } catch (error) {
      CustomError.createError(
        "Error",
        error.message,
        `Internal server Error, ${error.message}`,
        ERROR_TYPES.INTERNAL_SERVER_ERROR
      );
      next(error);
    }
  };

  static logout = async (req, res, next) => {
    let { web } = req.body;
    try {
      let userConn = await usersModel.findOne({ _id: req.session.user._id });
      userConn.last_connection = new Date();
      await userConn.save();

      const handleSessionDestroy = (error) => {
        if (error) {
          const logMethod = error.code !== 500 ? "error" : "fatal";
          req.logger[logMethod](
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
          return res.status(500).json({ error: "Unexpected server error" });
        }
      };

      req.session.destroy((error) => {
        handleSessionDestroy(error);
        if (error) {
          CustomError.createError(
            "Error",
            error.message,
            `Internal server Error, ${error.message}`,
            ERROR_TYPES.INTERNAL_SERVER_ERROR
          );
        }
        if (web === "web") {
          return res.redirect("/");
        } else {
          return res.json({ payload: "Successful logout" });
        }
      });
    } catch (error) {
      next(error);
    }
  };

  static register = (req, res, next) => {
    try {
      let { web } = req.body;
      if (web == "web") {
        res.redirect("/login");
      } else {
        return res
          .status(201)
          .json({ payload: "Successful registration", newUser: req.user });
      }
    } catch (error) {
      CustomError.createError(
        "Error",
        error.message,
        `Autentication server Error`,
        ERROR_TYPES.INTERNAL_SERVER_ERROR
      );
      next(error);
    }
  };

  static githubCallback = (req, res, next) => {
    try {
      req.session.user = req.user;
      return res.redirect("/");
    } catch (error) {
      CustomError.createError(
        "Error",
        error.message,
        `Autentication server Error`,
        ERROR_TYPES.INTERNAL_SERVER_ERROR
      );
      next(error);
    }
  };

  static current = (req, res, next) => {
    try {
      let user = req.session.user;
      let UserDTO = new UserViewDTO(user);
      res.json({ user: UserDTO });
    } catch (error) {
      CustomError.createError(
        "Error",
        error.message,
        `Autentication server Error`,
        ERROR_TYPES.INTERNAL_SERVER_ERROR
      );
      next(error);
    }
  };
}
