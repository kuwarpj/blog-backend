import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
