import express from "express";
import path from "path";
import __dirname from "./dirname.js";
import { engine } from "express-handlebars";
import compression from "express-compression";
import { Server } from "socket.io";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import { router as productRouter } from "./routes/productRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as sessionsRouter } from "./routes/sessionsRouter.js";
import { router as mockingRouter } from "./routes/mockingRouter.js";
import { router as loggerRouter } from "./routes/loggerRouter.js";
import { router as passwordRouter } from "./routes/passwordResetRouter.js";
import { router as userRouter } from "./routes/userRouter.js";
import sessions from "express-session";
import { messagesModel } from "./dao/models/messagesModel.js";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passportConfig.js";
import passport from "passport";
import { config } from "./config/config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger, middLogger } from "./utils/index.js";
import swaggerUI from "swagger-ui-express";
import { specs } from "./utils/index.js";

const PORT = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression({ brotli: { enabled: true } }));
app.use(
  sessions({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      ttl: 3600,
      mongoUrl: config.MONGO_URL,
      dbName: config.DB_NAME,
    }),
  })
);

app.use(middLogger);
initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", userRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/mockingproducts", mockingRouter);
app.use("/loggerTest", loggerRouter);
app.use("/", viewsRouter);
app.use("/", passwordRouter);

const server = app.listen(PORT, () =>
  logger.info(`Server listening in port:${PORT}`)
);

export const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("connectionServer", (connectionMessage) => {
    logger.info(connectionMessage);
  });
  socket.on("id", async (userName) => {
    let messages = await messagesModel.find();
    socket.emit("previousMessages", messages);
    socket.broadcast.emit("newUser", userName);
  });
  socket.on("newMessage", async (userName, message) => {
    await messagesModel.create({ user: userName, message: message });
    io.emit("sendMessage", userName, message);
  });
});

app.use(errorHandler);
