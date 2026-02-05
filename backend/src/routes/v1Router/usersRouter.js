import express from "express";
import {
  createUserController,
  getAllProfile,
  getUserByIdController,
  loginController,
} from "../../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/", getAllProfile);
userRouter.get("/:id", getUserByIdController);
userRouter.post("/create", createUserController);
userRouter.post("/login", loginController);

export default userRouter;
