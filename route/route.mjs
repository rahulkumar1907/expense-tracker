import express from "express";
import { validateUser, createUser } from "../controller/userController.mjs"; 

const router = express.Router();

router.post("/create-user", validateUser, createUser);

export default router;
