import { Server } from "socket.io";
import { verifyJwt } from "../utils/authJWT.js";
import { env } from "../config/serverConfig.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

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
    socket.join(socket.user.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.user.id);
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
