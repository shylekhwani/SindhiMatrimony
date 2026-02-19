import express from "express";
import userRouter from "./usersRouter.js";
import profileRouter from "./profileRouter.js";
import interestRouter from "./intrestRouter.js";
import matchRouter from "./matchRoute.js";
import chatRouter from "./chatRouter.js";
import notifyRouter from "./notificationRouter.js";

const v1Router = express.Router();

v1Router.use("/users", userRouter);
v1Router.use("/profile", profileRouter);
v1Router.use("/intrest", interestRouter);
v1Router.use("/match", matchRouter);
v1Router.use("/chat", chatRouter);
v1Router.use("/notify", notifyRouter);

export default v1Router;
