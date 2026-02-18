import MESSAGE from "../schemas/messageSchema.js";
import CHAT from "../schemas/chatSchema.js";

export const getChatMessagesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check chat exists
    const chat = await CHAT.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Verify user belongs to chat
    const isParticipant = chat.participants.some(
      (id) => id.toString() === userId,
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Unauthorized access to this chat",
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await MESSAGE.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      page: Number(page),
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
