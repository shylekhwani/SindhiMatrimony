import {
  createInterest,
  findInterest,
  findInterestById,
  updateInterestStatus,
  getReceivedInterests,
  getSentInterests,
} from "../repository/intrestRepo.js";

import { findMatchBetweenUsers, createMatch } from "../repository/matchRepo.js";
import INTEREST from "../schemas/intrestSchema.js";

export const sendInterestService = async (senderId, receiverId) => {
  try {
    if (senderId === receiverId) {
      throw { status: 400, message: "You cannot send request to yourself" };
    }

    // Check already matched
    const existingMatch = await findMatchBetweenUsers(senderId, receiverId);
    if (existingMatch) {
      throw { status: 400, message: "You are already matched" };
    }

    // Check same direction request
    const existingRequest = await findInterest(senderId, receiverId);
    if (existingRequest) {
      throw { status: 400, message: "Request already sent" };
    }

    // Check reverse request
    const reverseRequest = await findInterest(receiverId, senderId);

    if (reverseRequest && reverseRequest.status === "pending") {
      // Create Match
      await createMatch(senderId, receiverId);

      // Delete old pending request
      await INTEREST.findByIdAndDelete(reverseRequest._id);

      return { message: "It's a match!" };
    }

    // Otherwise create new request
    return await createInterest(senderId, receiverId);
  } catch (error) {
    console.log("Error in sendInterestService", error);
    throw error;
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

    const updatedInterest = await updateInterestStatus(interestId, action);

    // 🔥 If accepted → create match
    if (action === "accepted") {
      const alreadyMatched = await findMatchBetweenUsers(
        interest.sender,
        interest.receiver,
      );

      if (!alreadyMatched) {
        await createMatch(interest.sender, interest.receiver);
      }
    }

    return updatedInterest;
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
