import {
  createUser,
  findUserByEmail,
  findAllUser,
  getUserById,
} from "../repository/userRepo.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/authTokens.js";

export const createUserService = async function (user) {
  try {
    const newUser = await createUser(user);
    return newUser;
  } catch (error) {
    console.log("Error in createUserService:", error); // Debug log
    if (error.name === "MongoServerError" && error.code === 11000) {
      throw {
        status: 400,
        message: "User with same email already exists",
      };
    } else {
      throw error; // Re-throw other errors
    }
  }
};

export const loginUserService = async function (userDetails) {
  try {
    // check if there is valid registred user with the email
    const user = await findUserByEmail(userDetails.email);

    if (!user) {
      throw {
        status: 404,
        message: "User not found",
      };
    }
    // comapre the password
    const isPasswordValid = bcrypt.compareSync(
      userDetails.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: "Invalid Password",
      };
    }
    //  Business rules
    user.isActive = true;
    await user.save();

    // Tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    return {
      email: user.email,
      id: user.id,
      role: user.role,
      isActive: user.isActive,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("SignIn service error", error);
    throw error;
  }
};

export const getAllUserService = async function () {
  try {
    const user = await findAllUser();
    return user;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error; // Pass the error to the controller
  }
};

export const getUserByIdService = async function (id) {
  try {
    const user = await getUserById(id);
    return user;
  } catch (error) {
    console.error("Error in getUserByIdService:", error);
    throw error; // Pass the error to the controller
  }
};
