import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["INTEREST", "MATCH", "MESSAGE"],
      required: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId, // ChatId / MatchId / InterestId
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, type: 1, isRead: 1 });

const NOTIFICATION = mongoose.model("NOTIFICATION", notificationSchema);

export default NOTIFICATION;
