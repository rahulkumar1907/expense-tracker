import express from "express";
import { createUser } from "../controller/userController.mjs"; 

const router = express.Router();

router.post("/create-user", createUser); // Use createUser directly since it is destructured

export default router;
