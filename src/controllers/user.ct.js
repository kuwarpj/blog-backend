import { asyncHandler } from "../utils/asyncHandler.ut.js";
import { User } from "../models/user.mo.js";
import { ApiError, ApiResponse } from "../utils/helper.ut.js";
import { uploadOnCloudinary } from "../utils/fileUpload.ut.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existinguser = await User.findOne({ email });
  if (existinguser) {
    throw new ApiError(409, "user Already Exist with this email");
  }

  const profileImage = req.files?.profileImage[0]?.path;

  if (!profileImage) {
    throw new ApiError(500, "No Local Path found");
  }

  const avatar = await uploadOnCloudinary(profileImage);

  const user = await User.create({
    email,
    password,
    profileImage: avatar?.secure_url,
  });

  const newUser = await User.findById(user._id).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User Created Successfully"));
});

export { registerUser };
