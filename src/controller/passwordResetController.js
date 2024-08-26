import jwt from "jsonwebtoken";
import { usersModel } from "../dao/models/userModel.js";
import { config } from "../config/config.js";
import { createHash, validatePassword } from "../utils/index.js";
import { sendResetPassword } from "../utils/mailing.js";
import { CustomError } from "../utils/CustomError.js";
import { ERROR_TYPES } from "../utils/EErrors.js";

const JWT_SECRET = config.SECRET;

export const requestPasswordReset = (req, res) => {
  res.render("requestPasswordReset");
};

export const sendPasswordResetEmail = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      return CustomError.createError(
        "ERROR",
        null,
        "No user with that email",
        ERROR_TYPES.INVALID_ARGUMENTS
      );
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    sendResetPassword(token, user);
    res.status(200).json({
      status: "success",
      payload: `An email has been sent to ${user.email} with furter instructions.`,
    });
  } catch (error) {
    CustomError.createError(
      "ERROR",
      null,
      "Error sending email",
      ERROR_TYPES.INTERNAL_SERVER_ERROR
    );
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

export const resetPassword = (req, res) => {
  const token = req.params.token;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/request-password-reset");
    }

    res.render("resetPassword", { token });
  });
};

export const updatePassword = async (req, res, next) => {
  const token = req.params.token;
  const newPassword = req.body.password;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await usersModel.findOne({ email: decoded.email });
    if (!user) {
      return CustomError.createError(
        "ERROR",
        null,
        "User not found",
        ERROR_TYPES.NOT_FOUND
      );
    }
    if (!newPassword || !user.password) {
      return CustomError.createError(
        "ERROR",
        null,
        "Password fields cannot be empty",
        ERROR_TYPES.INVALID_ARGUMENTS
      );
    }

    const isSame = validatePassword(newPassword, user);
    if (isSame) {
      return CustomError.createError(
        "ERROR",
        null,
        "New password cannot be the same as the old password",
        ERROR_TYPES.INVALID_ARGUMENTS
      );
    }

    const hash = createHash(newPassword);
    user.password = hash;

    await user.save();
    return res
      .status(200)
      .json({ status: "success", payload: "Password has been reset" });
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
