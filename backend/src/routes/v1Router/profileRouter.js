import express from "express";
import {
  createProfileController,
  deleteProfileImageController,
  getAllProfileController,
  getProfileByIdController,
  getProfileBySelfController,
  updateProfileByIdController,
  uploadProfileImageController,
} from "../../controller/profileController.js";
import { isAdmin, isAuthenticated } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";

const profileRouter = express.Router();

profileRouter.get("/admin", isAdmin, getAllProfileController);
profileRouter.get("/:id", isAuthenticated, getProfileByIdController);
profileRouter.get("/", isAuthenticated, getProfileBySelfController);
profileRouter.post("/create", isAuthenticated, createProfileController);
profileRouter.patch("/update/me", isAuthenticated, updateProfileByIdController);
profileRouter.post(
  "/upload-photo",
  isAuthenticated,
  upload.single("photo"),
  uploadProfileImageController,
);
profileRouter.delete(
  "/photo/:photoId",
  isAuthenticated,
  deleteProfileImageController,
);

export default profileRouter;
