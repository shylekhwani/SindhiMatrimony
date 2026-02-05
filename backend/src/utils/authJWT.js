import jwt from "jsonwebtoken";

import { env } from "../config/serverConfig.js";

export const createJWT = function (payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "10d" });
};

export const verifyJwt = async function (token) {
  return jwt.verify(token, env.JWT_SECRET);
};
