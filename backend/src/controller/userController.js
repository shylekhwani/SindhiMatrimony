import {
  createUserService,
  getAllUserService,
  getUserByIdService,
  loginUserService,
} from "../services/userService.js";

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
    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: response,
    });
  } catch (error) {
    console.log("Error in signin:", error); // Debug log
    next(error);
  }
}

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
