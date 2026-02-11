import INTEREST from "../schemas/intrestSchema.js";

export const createInterest = async (data) => {
  try {
    const newIntrest = await INTEREST.create(data);
    return newIntrest;
  } catch (error) {
    console.log("error in intrestRepo", error);
    throw error;
  }
};

export const findInterest = async (sender, receiver) => {
  try {
    const intrest = await INTEREST.findOne({ sender, receiver });
    return intrest;
  } catch (error) {
    console.log("error in intrestRepo", error);
    throw error;
  }
};

export const findInterestById = async (id) => {
  try {
    const intrest = await INTEREST.findById(id);
    return intrest;
  } catch (error) {
    console.log("error in intrestRepo", error);
    throw error;
  }
};

export const updateInterestStatus = async (id, status) => {
  try {
    const intrest = await INTEREST.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return intrest;
  } catch (error) {
    console.log("error in intrestRepo", error);
    throw error;
  }
};

export const getReceivedInterests = async (userId) => {
  try {
    const intrest = await INTEREST.find({ receiver: userId })
      .populate("sender", "email role")
      .sort({ createdAt: -1 });
    return intrest;
  } catch (error) {
    console.log("error in intrestRepo", error);
    throw error;
  }
};

export const getSentInterests = async (userId) => {
  try {
    const intrest = await INTEREST.find({ sender: userId })
      .populate("receiver", "email role")
      .sort({ createdAt: -1 });
    return intrest;
  } catch (error) {
    console.log("error in intrestRepo", error);
    throw error;
  }
};
