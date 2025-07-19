import jwt from "jsonwebtoken";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { UserModel } from "../Models/auth.model.js";

export const TokenMiddleware = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.token ||
      req?.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unautorized request"));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decodedData?.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unautorized request"));
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unautorized request"));
  }
};
