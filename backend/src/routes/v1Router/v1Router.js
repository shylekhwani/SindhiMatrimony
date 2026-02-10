import express from "express";
import userRouter from "./usersRouter.js";
import profileRouter from "./profileRouter.js";

const v1Router = express.Router();

v1Router.use("/users", userRouter);
v1Router.use("/profile", profileRouter);

export default v1Router;
