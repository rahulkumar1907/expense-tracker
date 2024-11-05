import express from "express";
import {
  validateUser,
  createUser,
  loginUser,
  refreshAccessToken,
} from "../controller/userController.mjs";

import { authenticate } from "../middleware/auth.mjs";

const router = express.Router();

router.post("/create-user", validateUser, createUser);
router.post("/login", loginUser);
router.post("/refresh-access-token", refreshAccessToken);

export default router;
