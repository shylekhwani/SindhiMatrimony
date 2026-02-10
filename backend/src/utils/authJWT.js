import jwt from "jsonwebtoken";

import { env } from "../config/serverConfig.js";

export const createJWT = function (payload, days) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${days}` });
};

export const verifyJwt = async function (token) {
  return jwt.verify(token, env.JWT_SECRET);
};
