import express from "express";
import {
  validateUser,
  createUser,
  loginUser,
  refreshAccessToken,
  videoUpload,
} from "../controller/userController.mjs";
import multer from "multer";
import { authenticate } from "../middleware/auth.mjs";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('video');
const router = express.Router();

router.post("/create-user", validateUser, createUser);
router.post("/login", loginUser);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/video-upload",upload, videoUpload);

export default router;
