import { Comment } from "../models/comment.mo.js";
import { Blog } from "../models/blog.mo.js";
import { asyncHandler } from "../utils/asyncHandler.ut.js";
import { ApiError, ApiResponse, makenestedComments } from "../utils/helper.ut.js";

//create comment
const createComment = asyncHandler(async (req, res) => {
  const { blogId, content, parentComment } = req.body;

  if (!blogId || !content) {
    throw new ApiError(400, "Blog ID and content are required");
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const comment = await Comment.create({
    blog: blogId,
    author: req.user._id,
    content,
    parentComment: parentComment || null,
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate("author", "email")
    .populate("parentComment");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedComment, "Comment created"));
});

// get all comments
const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comments = await Comment.find({ blog: blogId })
    .populate("author", "email")
    .populate("parentComment")
    .sort({ createdAt: 1 });

  const nestedComments = makenestedComments(comments);

  return res
    .status(200)
    .json(new ApiResponse(200, nestedComments, "Comments fetched"));
});



export { createComment, getBlogComments };
