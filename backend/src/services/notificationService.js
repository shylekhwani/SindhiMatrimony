import NOTIFICATION from "../schemas/notificationSchema.js";
import { getIO } from "../config/socketConfig.js";

export const createNotification = async ({
  userId,
  type,
  referenceId,
  content,
}) => {
  try {
    const notification = await NOTIFICATION.create({
      userId,
      type,
      referenceId,
      content,
    });

    // Emit real-time if user online
    const io = getIO();
    io.to(userId.toString()).emit("new_notification", notification);

    return notification;
  } catch (error) {
    console.log("Err in notificationService");
    throw error;
  }
};

export const getNotificationsService = async function (userId) {
  try {
    const notifications = await NOTIFICATION.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return notifications;
  } catch (error) {
    console.log("Err in notificationService");
    throw error;
  }
};

export const getNotificationsByTypeService = async function (
  userId,
  type,
  page,
  limit,
) {
  try {
    const allowedTypes = ["MESSAGE", "MATCH", "INTEREST"];

    if (!allowedTypes.includes(type)) {
      throw new Error("Invalid notification type");
    }

    const skip = (page - 1) * limit;

    const notifications = await NOTIFICATION.find({ userId, type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return notifications;
  } catch (error) {
    console.log("Err in notificationService");
    throw error;
  }
};

export const markNotificationReadService = async function (id, userId) {
  try {
    const notifications = await NOTIFICATION.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true },
    );

    return notifications;
  } catch (error) {
    console.log("Err in notificationService");
    throw error;
  }
};

export const getUnreadCountService = async function (userId) {
  try {
    const unreadCount = await NOTIFICATION.countDocuments({
      userId,
      isRead: false,
    });

    return unreadCount;
  } catch (error) {
    console.log("Err in notificationService");
    throw error;
  }
};
