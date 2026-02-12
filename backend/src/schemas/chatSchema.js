import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// index for fast lookup
chatSchema.index({ participants: 1 });

const CHAT = mongoose.model("CHAT", chatSchema);

export default CHAT;
