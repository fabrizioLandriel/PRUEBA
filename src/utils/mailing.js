import nodemailer from "nodemailer";
import { config } from "../config/config.js";
import { logger } from "./index.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: "587",
  auth: {
    user: config.USER_GMAIL_NODEMAILER,
    pass: config.PASSWORD_GMAIL_NODEMAILER,
  },
});

export const sendTicket = (
  to,
  ticketCode,
  amount,
  purchaser,
  purchaseDatetime,
  products
) => {
  const productsTable = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Producto</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Cantidad</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Precio</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (item) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.product.title
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                item.quantity
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${
                item.quantity * item.product.price
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalles de la Compra</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 10px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                .content p {
                    margin: 0 0 10px;
                }
                .footer {
                    background-color: #f4f4f4;
                    color: #666666;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                }
                .products {
                    margin-top: 20px;
                }
                .products table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .products table, .products th, .products td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                .products th {
                    background-color: #f2f2f2;
                }
                .products td {
                    text-align: left;
                }
                .products td:last-child {
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Detalles de la Compra</h1>
                </div>
                <div class="content">
                    <p><strong>Código:</strong> ${ticketCode}</p>
                    <p><strong>Importe:</strong> $${amount}</p>
                    <p><strong>Comprador:</strong> ${purchaser}</p>
                    <p><strong>Fecha de la Compra:</strong> ${purchaseDatetime}</p>
                    <div class="products">
                        <h2>Productos Comprados:</h2>
                        ${productsTable}
                    </div>
                </div>
                <div class="footer">
                    <p>2024 Victor Molina. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  transporter
    .sendMail({
      from: "Victor Molina <molinavitillo@gmail.com>",
      to: to,
      subject: `Ticket #${ticketCode}`,
      html: htmlContent,
    })
    .then((result) => {
      result = JSON.stringify(result);
      logger.debug(result);
    })
    .catch((error) => {
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
    });
};

export const sendResetPassword = (token, user) => {
  let URL = config.URL;
  const mailOptions = {
    to: user.email,
    from: "Victor Molina <molinavitillo@gmail.com>",
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://${URL}/reset/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.`,
  };

  transporter
    .sendMail(mailOptions)
    .then((result) => {
      result = JSON.stringify(result);
      logger.debug(result);
    })
    .catch((error) => {
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
    });
};

export const sendAccountDeletionNotification = async (to, userName, logger) => {
  try {
    const mailOptions = {
      from: "Victor Molina <molinavitillo@gmail.com>",
      to: to,
      subject: "Account Deletion Notification",
      text: `Hello ${userName},\n\nYour account has been deleted due to inactivity.\n\nBest regards,\nVictor Molina`,
    };

    await transporter.sendMail(mailOptions);

    logger.debug(
      `Email sent successfully to ${to} notifying account deletion.`
    );
  } catch (error) {
    if (error.code !== 500) {
      logger.error(
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
      logger.fatal(
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
    throw CustomError.createError(
      "Email Error",
      null,
      `Failed to send account deletion notification to ${to}`,
      ERROR_TYPES.INTERNAL_ERROR
    );
  }
};

export const sendProductDeletionNotification = async (
  to,
  productName,
  logger
) => {
  try {
    const mailOptions = {
      from: "Victor Molina <molinavitillo@gmail.com>",
      to: to,
      subject: "Product Deletion Notification",
      text: `Hello,\n\nWe wanted to inform you that your product "${productName}" has been deleted.\n\nBest regards,\nVictor Molina`,
    };

    await transporter.sendMail(mailOptions);

    logger.debug(
      `Email sent successfully to ${to} notifying product deletion.`
    );
  } catch (error) {
    if (error.code !== 500) {
      logger.error(
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
      logger.fatal(
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
    throw CustomError.createError(
      "Email Error",
      null,
      `Failed to send product deletion notification to ${to}`,
      ERROR_TYPES.INTERNAL_ERROR
    );
  }
};
