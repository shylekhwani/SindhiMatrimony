import express from "express";
import { getChatMessagesController } from "../../controller/chatController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.get("/:chatId", isAuthenticated, getChatMessagesController);

export default chatRouter;
