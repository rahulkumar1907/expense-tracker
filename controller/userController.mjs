import { validationResult, body } from "express-validator";
import userModel from "../model/userModel.mjs";
import { hash } from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// Define the validation rules
const validateUser = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("age")
    .optional()
    .isInt({ gt: 0, lt: 100 })
    .withMessage("Age must be between 1 and 99"),
  body("title")
    .optional()
    .isIn(["Mr", "Mrs", "Miss"])
    .withMessage("Invalid title"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),
];

// Define the createUser function
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: false, message: errors.array() });
  }

  try {
    const { name, email, password, age, title } = req.body;

    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .send({ status: false, message: "User already exist" });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user instance
    const newUser = {
      name,
      email,
      password: hashedPassword, // Save the hashed password
      age,
      title,
    };

    const savedUser = await userModel.create(newUser);

    return res.status(201).send({
      status: true,
      data: savedUser,
      message: "User created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    //  Verify password using bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //  Generate JWT token
    const accessToken = jwt.sign(
      { username: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Set token expiration time for access token
    );

    // Refresh token (long-lived, expires in 30 days, for example)
    const refreshToken = jwt.sign(
      { username: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    // set access token in headers
    res.setHeader("Authorization", `Bearer ${token}`);
    // set refresh token in a secure, HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // can't be accessed via JavaScript
      secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // refresh token expires in 30 days
      sameSite: "Strict", // prevent CSRF attacks
    });
    //  Send the token back to the client
    return res.status(200).send({
      status: true,
      message: "user logged in succesfully",
      data: token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    // get refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(403)
        .send({ status: false, message: "refresh token missing" });
    }

    // verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // check if the user exists based on the decoded data
    const user = await userModel.findOne({ email: decoded.username });
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .send({ status: false, message: "Invalid refresh token" });
    }

    // generate a new access token
    const newAccessToken = jwt.sign(
      { username: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // new access token expires in 24 hours
    );

    // Send the new access token back to the client
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    return res.status(200).send({
      status: true,
      message: "access token refreshed successfully",
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "failed to refresh access token" });
  }
};

// Export the validation rules and the createUser function
export { validateUser, createUser, loginUser, refreshAccessToken };
