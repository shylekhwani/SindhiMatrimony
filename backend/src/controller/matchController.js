import { getUserMatches } from "../repository/matchRepo.js";

export const getMyMatchesController = async (req, res, next) => {
  try {
    const matches = await getUserMatches(req.user.id);

    return res.status(200).json({
      success: true,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};
