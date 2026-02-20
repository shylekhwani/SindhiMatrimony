import cron from "node-cron";
import NOTIFICATION from "../schemas/notificationSchema.js";

export const startNotificationCleanupJob = () => {
  // Runs every day at 3:00 AM
  cron.schedule("0 3 * * *", async () => {
    /*
    Minute: 0
    Hour: 3
    Every day
     */
    try {
      console.log("🧹 Running notification cleanup job...");

      const twentyDaysAgo = new Date();
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

      const result = await NOTIFICATION.deleteMany({
        isRead: true,
        createdAt: { $lt: twentyDaysAgo },
      });

      console.log(`🗑 Deleted ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error("Cleanup job error:", error.message);
    }
  });
};
