import {
  createProfile,
  findAllProfiles,
  getProfileById,
  updateProfile,
} from "../repository/profileRepo.js";
import { calculateProfileCompletion } from "../utils/profileCompletion.js";
import cloudinary from "../config/cloudinaryConfig.js";
import PROFILE from "../schemas/profileSchema.js";

export const createProfileService = async function (user) {
  try {
    // 1. Calculate completion from incoming profile data
    const { percentage, isCompleted } = calculateProfileCompletion(user);

    // 2. Attach derived fields
    const profileData = {
      ...user,
      completionPercentage: percentage,
      profileCompleted: isCompleted,
    };

    const newprofile = await createProfile(profileData);
    return newprofile;
  } catch (error) {
    console.log("Error in createProfileService:", error); // Debug log
    if (error.name === "MongoServerError" && error.code === 11000) {
      throw {
        status: 400,
        message: "User with same Profile already exists",
      };
    } else {
      throw error; // Re-throw other errors
    }
  }
};

export const getAllProfileService = async function () {
  try {
    const Profiles = await findAllProfiles();
    return Profiles;
  } catch (error) {
    console.error("Error in getAllProfiles:", error);
    throw error; // Pass the error to the controller
  }
};

export const getProfileByIdService = async function (id) {
  try {
    const Profile = await getProfileById(id);
    return Profile;
  } catch (error) {
    console.error("Error in getProfileByIdService:", error);
    throw error; // Pass the error to the controller
  }
};

export const updateProfileService = async function (id, data) {
  try {
    const Profile = await getProfileById(id);
    if (!Profile) {
      throw {
        status: 404,
        message: "profile not found",
      };
    }
    const updatedProfile = Object.assign(Profile, data);

    // console.log("updateprofile", updatedProfile);

    const { percentage, isCompleted } =
      calculateProfileCompletion(updatedProfile);

    Profile.completionPercentage = percentage;
    Profile.profileCompleted = isCompleted;

    await Profile.save();
    return Profile;
  } catch (error) {
    console.error("Error in updateProfileService:", error);
    throw error; // Pass the error to the controller
  }
};

export const uploadProfileImageService = async (userId, file) => {
  if (!file) {
    throw { status: 400, message: "Image file required" };
  }

  const profile = await PROFILE.findOne({ userId });
  if (!profile) {
    throw { status: 404, message: "Profile not found" };
  }

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "profiles",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(file.buffer);
  });

  // Save metadata only
  profile.photos.push({
    url: result.secure_url,
    publicId: result.public_id,
    isPrimary: profile.photos.length === 0, // first photo auto primary
  });

  await profile.save();
  return profile.photos;
};

export const deleteProfileImageService = async (userId, photoId) => {
  const profile = await PROFILE.findOne({ userId });

  if (!profile) {
    throw { status: 404, message: "Profile not found" };
  }

  const photoIndex = profile.photos.findIndex(
    (photo) => photo.publicId === photoId,
  );

  if (photoIndex === -1) {
    throw { status: 404, message: "Photo not found" };
  }

  const photo = profile.photos[photoIndex];

  // 1️⃣ Delete from Cloudinary
  await cloudinary.uploader.destroy(photo.publicId);

  // 2️⃣ Remove from DB
  profile.photos.splice(photoIndex, 1);

  // 3️⃣ Maintain primary photo rule
  if (photo.isPrimary && profile.photos.length > 0) {
    profile.photos[0].isPrimary = true;
  }

  await profile.save();

  return profile.photos;
};
