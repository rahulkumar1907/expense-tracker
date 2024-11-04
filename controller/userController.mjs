import { validationResult, body } from "express-validator";
import userModel from "../model/userModel.mjs";
import { hash } from "bcrypt";

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
];

// Define the createUser function
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ status: false, message: errors.array() });
  }

  try {
    const { name, email, password, age, title } = req.body;

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

// Export the validation rules and the createUser function
export { validateUser, createUser };
