import { asyncHandler } from "../utils/asyncHandler.ut.js";
import { Blog } from "../models/blog.mo.js";
import { ApiError, ApiResponse } from "../utils/helper.ut.js";
import { uploadOnCloudinary } from "../utils/fileUpload.ut.js";

// Create a new blog
const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required");
  }

  const imageFilePath = req.files?.blogImage[0]?.path;

  if (!imageFilePath) {
    throw new ApiError(500, "No Local Path found");
  }
  const uploadedBlogImage = await uploadOnCloudinary(imageFilePath);

  const blog = await Blog.create({
    title,
    description,
    blogImage: uploadedBlogImage?.secure_url,
    author: req.user._id,
  });

  const populatedBlog = await Blog.findById(blog._id).populate(
    "author",
    "email"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedBlog, "Blog created successfully"));
});

// Get list of all blogs
const getUserBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate("author", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "User blogs retrieved"));
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this blog");
  }

  const { title, description } = req.body;
  if (title) blog.title = title;
  if (description) blog.description = description;

  if (req.files?.blogImage?.[0]?.path) {
    const newImage = await uploadOnCloudinary(req.files.blogImage[0].path);
    blog.blogImage = newImage?.secure_url || blog.blogImage;
  }

  await blog.save();

  const updatedBlog = await Blog.findById(blog._id).populate("author", "name email");

  return res.status(200).json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
});


const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id).populate("author", "name email");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, blog, "Blog retrieved successfully"));
});




const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to delete this blog");
  }

  await blog.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});



export { createBlog, getUserBlogs, updateBlog, deleteBlog, getBlogById };
