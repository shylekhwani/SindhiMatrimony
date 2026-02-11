import MATCH from "../schemas/matchSchema.js";

export const createMatch = async (userA, userB) => {
  try {
    return await MATCH.create({
      users: [userA, userB],
    });
  } catch (error) {
    console.log("error in matchRepo", error);
    throw error;
  }
};

export const findMatchBetweenUsers = async (userA, userB) => {
  try {
    return await MATCH.findOne({
      users: { $all: [userA, userB] },
    });
  } catch (error) {
    console.log("error in matchRepo", error);
    throw error;
  }
};

export const getUserMatches = async (userId) => {
  try {
    return await MATCH.find({
      users: userId,
    })
      .populate("users", "email role")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.log("error in matchRepo", error);
    throw error;
  }
};
