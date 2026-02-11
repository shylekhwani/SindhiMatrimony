import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevent duplicate interest between same users
 * User A → B can exist only once
 */
interestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const INTEREST = mongoose.model("INTEREST", interestSchema);

export default INTEREST;
