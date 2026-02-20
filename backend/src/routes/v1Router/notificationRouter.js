import express from "express";
import { isAuthenticated } from "../../middleware/authMiddleware.js";
import {
  getNotificationsByTypeController,
  getNotificationsController,
  getUnreadCountController,
  markNotificationReadController,
} from "../../controller/notificationController.js";

const notifyRouter = express.Router();

notifyRouter.get("/", isAuthenticated, getNotificationsByTypeController);
notifyRouter.get("/all", isAuthenticated, getNotificationsController);
notifyRouter.get("/unread", isAuthenticated, getUnreadCountController);

notifyRouter.patch(
  "/:id/read",
  isAuthenticated,
  markNotificationReadController,
);

export default notifyRouter;
