import {
  sendInterestService,
  respondToInterestService,
  getReceivedInterestsService,
  getSentInterestsService,
} from "../services/intrestService.js";

export const sendInterestController = async (req, res, next) => {
  try {
    const receiverId = req.body.receiverId;

    const interest = await sendInterestService(req.user.id, receiverId);

    return res.status(201).json({
      success: true,
      message: "Interest sent successfully",
      data: interest,
    });
  } catch (error) {
    next(error);
  }
};

export const respondToInterestController = async (req, res, next) => {
  try {
    const { interestId, action } = req.body;

    const updated = await respondToInterestService(
      interestId,
      req.user.id,
      action,
    );

    return res.status(200).json({
      success: true,
      message: `Interest ${action}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getReceivedInterestsController = async (req, res, next) => {
  try {
    const interests = await getReceivedInterestsService(req.user.id);

    return res.status(200).json({
      success: true,
      data: interests,
    });
  } catch (error) {
    next(error);
  }
};

export const getSentInterestsController = async (req, res, next) => {
  try {
    const interests = await getSentInterestsService(req.user.id);

    return res.status(200).json({
      success: true,
      data: interests,
    });
  } catch (error) {
    next(error);
  }
};
