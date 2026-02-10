import express from "express";
import {
  createUserController,
  getAllProfile,
  getUserByIdController,
  loginController,
  logoutController,
  refreshTokenController,
} from "../../controller/userController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", getAllProfile);
userRouter.get("/:id", getUserByIdController);
userRouter.post("/create", createUserController);
userRouter.post("/login", loginController);
userRouter.post("/refresh", refreshTokenController);
userRouter.post("/logout", isAuthenticated, logoutController);

export default userRouter;
