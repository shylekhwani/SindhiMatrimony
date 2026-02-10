import {
  createProfileService,
  deleteProfileImageService,
  getAllProfileService,
  getProfileByIdService,
  updateProfileService,
  uploadProfileImageService,
} from "../services/profileService.js";

export const createProfileController = async function (req, res, next) {
  try {
    const data = {
      ...req.body,
      userId: req.user.id, // from auth middleware
    };
    const newProfile = await createProfileService(data);
    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: newProfile,
    });
  } catch (error) {
    next(error);
    console.log("Internal server error on controller");
  }
};

export async function getAllProfileController(req, res, next) {
  try {
    const Profile = await getAllProfileService();

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: Profile,
    });
  } catch (error) {
    console.error("Error in getAllProfile:", error);
    next(error);
  }
}

export async function getProfileByIdController(req, res, next) {
  try {
    const id = req.params.id;
    const Profile = await getProfileByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: Profile,
    });
  } catch (error) {
    console.error("Error in getProfileByIdController:", error);
    next(error);
  }
}

export async function getProfileBySelfController(req, res, next) {
  try {
    const id = req.user.id;
    console.log("id", id);
    const Profile = await getProfileByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: Profile,
    });
  } catch (error) {
    console.error("Error in getProfileByIdController:", error);
    next(error);
  }
}

export async function updateProfileByIdController(req, res, next) {
  try {
    const id = req.user.id;
    const data = req.body;
    const Profile = await updateProfileService(id, data);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: Profile,
    });
  } catch (error) {
    console.error("Error in updateProfileByIdController:", error);
    next(error);
  }
}

export const uploadProfileImageController = async (req, res, next) => {
  try {
    const photos = await uploadProfileImageService(req.user.id, req.file);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: photos,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfileImageController = async (req, res, next) => {
  try {
    const { photoId } = req.params;

    const photos = await deleteProfileImageService(req.user.id, photoId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: photos,
    });
  } catch (error) {
    next(error);
  }
};
