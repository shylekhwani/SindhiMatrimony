import {
  createUserService,
  getAllUserService,
  getUserByIdService,
  loginUserService,
} from "../services/userService.js";

import { refreshAccessToken, logoutAllDevices } from "../utils/authTokens.js";

export const createUserController = async function (req, res, next) {
  try {
    const data = req.body;
    // console.log("data in cont", data);
    const newUser = await createUserService(data);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
    console.log("Internal server error on controller");
  }
};

export async function loginController(req, res, next) {
  try {
    // console.log("login", req.body);
    const response = await loginUserService(req.body);

    const { refreshToken, accessToken, ...rest } = response;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: { ...rest, accessToken },
    });
  } catch (error) {
    console.log("Error in signin:", error); // Debug log
    next(error);
  }
}

export const logoutController = async (req, res) => {
  await logoutAllDevices(req.user.id);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
};

export const singleLogoutController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const userId = await redis.get(`refresh:${refreshToken}`);

    if (userId) {
      await redis
        .multi()
        .del(`refresh:${refreshToken}`)
        .srem(`user_sessions:${userId}`, refreshToken)
        .exec();
    }
  }

  res.clearCookie("refreshToken");

  res.json({ success: true, message: "Logged out" });
};

export async function getAllProfile(req, res, next) {
  try {
    const users = await getAllUserService();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error in getAllProfile:", error);
    next(error);
  }
}

export async function getUserByIdController(req, res, next) {
  try {
    const id = req.params.id;
    const user = await getUserByIdService(id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserByIdController:", error);
    next(error);
  }
}

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
