import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/dbConfig.js";
import { env } from "./config/serverConfig.js";
import { initSocket } from "./config/socketConfig.js";

const startServer = async () => {
  await connectDB();

  // HTTP server from express app
  const server = createServer(app);

  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
