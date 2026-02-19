import express from "express";
import { isAuthenticated } from "../../middleware/authMiddleware.js";
import {
  getNotificationsController,
  getUnreadCountController,
  markNotificationReadController,
} from "../../controller/notificationController.js";

const notifyRouter = express.Router();

notifyRouter.get("/", isAuthenticated, getNotificationsController);
notifyRouter.get("/unread", isAuthenticated, getUnreadCountController);
notifyRouter.patch(
  "/:id/read",
  isAuthenticated,
  markNotificationReadController,
);

export default notifyRouter;
