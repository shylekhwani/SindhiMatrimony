import express from "express";
import {
  sendInterestController,
  respondToInterestController,
  getReceivedInterestsController,
  getSentInterestsController,
} from "../../controller/intrestController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const interestRouter = express.Router();

interestRouter.post("/create", isAuthenticated, sendInterestController);

interestRouter.patch("/respond", isAuthenticated, respondToInterestController);

interestRouter.get(
  "/received",
  isAuthenticated,
  getReceivedInterestsController,
);

interestRouter.get("/sent", isAuthenticated, getSentInterestsController);

export default interestRouter;
