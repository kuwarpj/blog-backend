import express from "express";
import { authenticate } from "../middlewares/auth.mw.js";
import { createComment, getBlogComments } from "../controllers/comment.ct.js";

const router = express.Router();

router.post("/createcomment", authenticate, createComment); 
router.get("/:blogId", getBlogComments); 

export default router;
