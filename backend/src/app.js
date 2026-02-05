import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/apiRouter.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Sindhi Matrimony Backend" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server",
    source: "From Custom err handle middlewear",
  });
});

export default app;
