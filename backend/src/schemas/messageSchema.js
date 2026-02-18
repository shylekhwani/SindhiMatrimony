import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CHAT",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// index for faster retrieval
messageSchema.index({ chatId: 1, createdAt: -1 });

const MESSAGE = mongoose.model("MESSAGE", messageSchema);

export default MESSAGE;
