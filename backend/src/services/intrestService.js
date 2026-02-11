import {
  createInterest,
  findInterest,
  findInterestById,
  updateInterestStatus,
  getReceivedInterests,
  getSentInterests,
} from "../repository/intrestRepo.js";

export const sendInterestService = async (senderId, receiverId) => {
  try {
    if (senderId === receiverId) {
      throw { status: 400, message: "Cannot send interest to yourself" };
    }

    const existing = await findInterest(senderId, receiverId);
    if (existing) {
      throw { status: 400, message: "Interest already sent" };
    }

    return await createInterest({
      sender: senderId,
      receiver: receiverId,
    });
  } catch (error) {
    console.error("Error in sendInterestService:", error);
    throw error; // Pass the error to the controller
  }
};

export const respondToInterestService = async (interestId, userId, action) => {
  try {
    const interest = await findInterestById(interestId);

    if (!interest) {
      throw { status: 404, message: "Interest not found" };
    }

    if (interest.receiver.toString() !== userId.toString()) {
      throw { status: 403, message: "Unauthorized action" };
    }

    if (interest.status !== "pending") {
      throw { status: 400, message: "Interest already responded" };
    }

    if (!["accepted", "rejected"].includes(action)) {
      throw { status: 400, message: "Invalid action" };
    }

    return await updateInterestStatus(interestId, action);
  } catch (error) {
    console.error("Error in respondToInterestService:", error);
    throw error; // Pass the error to the controller
  }
};

export const getReceivedInterestsService = async (userId) => {
  try {
    return await getReceivedInterests(userId);
  } catch (error) {
    console.error("Error in getReceivedInterestsService:", error);
    throw error; // Pass the error to the controller
  }
};

export const getSentInterestsService = async (userId) => {
  try {
    return await getSentInterests(userId);
  } catch (error) {
    console.error("Error in getSentInterestsService:", error);
    throw error; // Pass the error to the controller
  }
};
