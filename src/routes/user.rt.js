import { Router } from "express";
import { upload } from "../middlewares/multer.mw.js";
import { registerUser, loginUser } from "../controllers/user.ct.js";

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
router.route("/login").post(loginUser);

export default router;
