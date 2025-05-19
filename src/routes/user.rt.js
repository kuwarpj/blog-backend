import { Router } from "express";
import { upload } from "../middlewares/multer.mw.js";
import { registerUser } from "../controllers/user.ct.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
