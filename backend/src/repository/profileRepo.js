import PROFILE from "../schemas/profileSchema.js";

export const findAllProfiles = async function () {
  try {
    const users = await PROFILE.find({
      profileCompleted: true,
    });
    return users;
  } catch (error) {
    console.log("error in ProfileRepo", error);
    throw error;
  }
};

export const createProfile = async function (user) {
  try {
    const newProfile = await PROFILE.create(user);
    return newProfile;
  } catch (error) {
    console.log("error in ProfileRepo", error);
    throw error;
  }
};

export const getProfileById = async function (id) {
  try {
    const user = await PROFILE.findOne({ userId: id });
    if (!user) return null;

    return user;
  } catch (error) {
    console.log("error in ProfileRepo", error);
    throw error;
  }
};

export const deleteProfileById = async function (id) {
  try {
    const Profile = await PROFILE.findByIdAndDelete(id);
    return Profile;
  } catch (error) {
    console.log("error in ProfileRepo", error);
    throw error;
  }
};

export const updateProfile = async function (id, ProfileToUpdate) {
  try {
    const Profile = await PROFILE.findOneAndUpdate(
      { userId: id },
      ProfileToUpdate,
      {
        new: true,
      },
    );

    if (!Profile) {
      throw { status: 404, message: "Profile not found" };
    }

    return Profile;
  } catch (error) {
    console.log("error in ProfileRepo", error);
    throw error;
  }
};

export const searchProfiles = async (filters, options) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = options;

  const skip = (page - 1) * limit;

  const sortDirection = order === "asc" ? 1 : -1;

  const profiles = await PROFILE.find(filters)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(limit)
    .select("-photos.publicId")
    .lean();

  const total = await PROFILE.countDocuments(filters);

  return {
    profiles,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
