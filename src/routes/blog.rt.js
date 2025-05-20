import { Router } from "express";
import { upload } from "../middlewares/multer.mw.js";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getUserBlogs,
  updateBlog,
} from "../controllers/blog.ct.js";
import { authenticate } from "../middlewares/auth.mw.js";

const router = Router();

router.route("/createblog").post(
  upload.fields([
    {
      name: "blogImage",
      maxCount: 1,
    },
  ]),
  authenticate,
  createBlog
);

router.get("/myblogs", authenticate, getUserBlogs);
router
  .route("/:id")
  .put(
    authenticate,
    upload.fields([
      {
        name: "blogImage",
        maxCount: 1,
      },
    ]),
    updateBlog
  )
  .delete(authenticate, deleteBlog);
router.get("/:id", getBlogById);

export default router;
