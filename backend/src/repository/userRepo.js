import USER from "../schemas/userSchema.js";

export const findUserByEmail = async function (email) {
  try {
    const user = await USER.findOne({ email }).select("+password");
    return user;
  } catch (error) {
    console.log("error in UserRepo", error);
    throw error;
  }
};

// Function to retrieve all users from the database
export const findAllUser = async function () {
  try {
    // Finding all users in the database
    const users = await USER.find();
    // Returning the list of users found
    return users;
  } catch (error) {
    console.log("error in UserRepo", error);
    throw error;
  }
};

export const createUser = async function (user) {
  try {
    // console.log("log in user", user);
    const newUser = await USER.create(user);
    return newUser;
  } catch (error) {
    console.log("error in UserRepo", error);
    throw error;
  }
};

export const getUserById = async function (id) {
  try {
    const user = await USER.findById(id);
    if (!user) return null;

    return user;
  } catch (error) {
    console.log("error in UserRepo", error);
    throw error;
  }
};

export const deleteUserById = async function (id) {
  try {
    const user = await USER.findByIdAndDelete(id);
    return user;
  } catch (error) {
    console.log("error in UserRepo", error);
    throw error;
  }
};

export const updateUser = async function (id, userToUpdate) {
  try {
    const user = await USER.findByIdAndUpdate(id, userToUpdate, { new: true });
    return user;
  } catch (error) {
    console.log("error in UserRepo", error);
    throw error;
  }
};
