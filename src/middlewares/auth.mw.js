import jwt from "jsonwebtoken";
import { ApiError } from "../utils/helper.ut.js";
import { User } from "../models/user.mo.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies.jwtToken ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      throw new ApiError(401, "Access denied. ");
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    req.user = user;

    next();
  } catch (err) {
    return next(new ApiError(401, "Unauthorised access"));
  }
};
