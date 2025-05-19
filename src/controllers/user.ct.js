import { asyncHandler } from "../utils/asyncHandler.ut.js";
import { User } from "../models/user.mo.js";
import { ApiError, ApiResponse } from "../utils/helper.ut.js";
import { uploadOnCloudinary } from "../utils/fileUpload.ut.js";

const generateJwtToken = async (userId) => {
  try {
    const user = await  User.findById(userId);
    const jwtToken = await user.generateJwtToken();
    return { jwtToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email not found");
  }
  const correctPassword = await user.isPasswordCorrect(password);
  if (!correctPassword) {
    throw new ApiError(401, "Passowrd is incorrect");
  }

  const { jwtToken } = await generateJwtToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password");
  loggedInUser.token = jwtToken;
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("jwtToken", jwtToken, options)
    .json(new ApiResponse(200, loggedInUser, "Login Successfull"));
});

export { registerUser, loginUser };
