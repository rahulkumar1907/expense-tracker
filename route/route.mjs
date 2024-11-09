import express from "express";
import {
  validateUser,
  createUser,
  loginUser,
  refreshAccessToken,
  videoUpload,
} from "../controller/userController.mjs";
import { copyFile ,streamFile,streamVideo} from "../controller/readFile.mjs";
import multer from "multer";
import { authenticate } from "../middleware/auth.mjs";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("video");
const router = express.Router();

router.post("/create-user", validateUser, createUser);
router.post("/login", loginUser);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/video-upload/:userId", upload, videoUpload);
router.get("/copy-file", copyFile);
router.get("/stream-file", streamFile);
router.get("/stream-video", streamVideo);

export default router;
