import { Server } from "socket.io";
import { verifyJwt } from "../utils/authJWT.js";
import { env } from "../config/serverConfig.js";
import MESSAGE from "../schemas/messageSchema.js";
import { getOrCreateChat } from "../services/chatService.js";
import CHAT from "../schemas/chatSchema.js";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import { redis } from "./redisConfig.js";

let io;

export const initSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // 🔴 Create Redis pub/sub clients
  const pubClient = new Redis(env.REDIS_URL);
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  /*
  const pubClient = createClient({ url: env?.REDIS_URL });
  const subClient = pubClient.duplicate();
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));
  */
  console.log("✅ Redis adapter connected for Socket.io");

  // 🔐 Auth Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      const decoded = verifyJwt(token, env.JWT_SECRET);

      // Attach user to socket
      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const user = await socket.user;
    console.log("⚡ Authenticated user:", user.id);

    // Join personal room
    socket.join(user.id);

    // =============================
    // 🟢 ONLINE LOGIC
    // =============================

    const onlineKey = `online:${user.id}`;

    // Increment active connection count
    const connections = await redis.incr(onlineKey);

    // Set expiry safety (optional but good practice)
    await redis.expire(onlineKey, 60 * 60); // 1 hour TTL

    // If first connection → broadcast online
    if (connections === 1) {
      socket.broadcast.emit("user_online", user.id);
      console.log(`🟢 User ${user.id} is now ONLINE`);
    }

    // 📩 Send Message Event
    socket.on("send_message", async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content) {
          return socket.emit("error", "Missing fields");
        }

        // 1️⃣ Get or create chat
        const chat = await getOrCreateChat(user.id, receiverId);

        // 2️⃣ Save message
        const message = await MESSAGE.create({
          chatId: chat._id,
          sender: user.id,
          content,
        });

        // 3️⃣ Update chat last message
        chat.lastMessage = content;
        chat.lastMessageAt = new Date();
        await chat.save();

        // 4️⃣ Emit to receiver room
        io.to(receiverId).emit("new_message", message);

        // 5️⃣ Emit back to sender (confirmation)
        socket.emit("message_sent", message);
      } catch (error) {
        socket.emit("error", error.message);
      }
    });

    socket.on("mark_as_seen", async ({ chatId }) => {
      try {
        if (!chatId) {
          return socket.emit("error", "Chat ID required");
        }

        // 1️⃣ Update unseen messages (only messages NOT sent by current user)
        const result = await MESSAGE.updateMany(
          {
            chatId,
            sender: { $ne: socket.user.id },
            seen: false,
          },
          {
            $set: { seen: true },
          },
        );

        // 2️⃣ Notify other participant
        const chat = await CHAT.findById(chatId);

        const otherUser = chat.participants.find(
          (id) => id.toString() !== socket.user.id,
        );

        io.to(otherUser.toString()).emit("messages_seen", {
          chatId,
          seenBy: socket.user.id,
        });

        socket.emit("seen_updated", {
          chatId,
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        socket.emit("error", error.message);
      }
    });

    // =============================
    // 🔴 OFFLINE LOGIC
    // =============================

    socket.on("disconnect", async () => {
      try {
        const remainingConnections = await redis.decr(onlineKey);

        if (remainingConnections <= 0) {
          await redis.del(onlineKey);

          socket.broadcast.emit("user_offline", user.id);
          console.log(`🔴 User ${user.id} is OFFLINE`);
        }
      } catch (error) {
        console.error("Presence error:", error.message);
      }

      console.log("❌ User disconnected:", user.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
