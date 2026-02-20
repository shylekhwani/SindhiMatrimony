import { z } from "zod";

export const sendMessageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long")
    .trim(),
});
