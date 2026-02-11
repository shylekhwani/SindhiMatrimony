import express from "express";
import userRouter from "./usersRouter.js";
import profileRouter from "./profileRouter.js";
import interestRouter from "./intrestRouter.js";

const v1Router = express.Router();

v1Router.use("/users", userRouter);
v1Router.use("/profile", profileRouter);
v1Router.use("/intrest", interestRouter);

export default v1Router;
