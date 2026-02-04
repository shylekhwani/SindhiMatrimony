import app from "./app.js";
import { connectDB } from "./config/dbConfig.js";
import { env } from "./config/serverConfig.js";

const startServer = async () => {
  await connectDB();
  

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
