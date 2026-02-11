import express from "express";
import { getMyMatchesController } from "../../controller/matchController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const matchRouter = express.Router();

matchRouter.get("/my", isAuthenticated, getMyMatchesController);

export default matchRouter;
