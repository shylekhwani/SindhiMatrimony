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
import { authLimiter } from "../../middleware/ratelimiter.js";

const userRouter = express.Router();

userRouter.get("/", getAllProfile);
userRouter.get("/:id", getUserByIdController);
userRouter.post("/create", authLimiter, createUserController);
userRouter.post("/login", authLimiter, loginController);
userRouter.post("/refresh", refreshTokenController);
userRouter.post("/logout", isAuthenticated, logoutController);

export default userRouter;
