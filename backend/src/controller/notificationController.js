import {
  getNotificationsService,
  getUnreadCountService,
  markNotificationReadService,
} from "../services/notificationService.js";

export const getNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await getNotificationsService(userId);

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationReadController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await markNotificationReadService(id, userId);

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCountController = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await getUnreadCountService(userId);

    res.json({ unread: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
