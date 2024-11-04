import { validationResult } from 'express-validator';
import userModel from '../models/userModel';
import { hash } from 'bcrypt'; 

const createUser = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({status:false, message: errors.array() });
  }

  try {
    const { name, email, password, age, title } = req.body;

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      age,
      title,
    });

    const savedUser = await userModel.create(newUser);

    return res.status(201).send({status:true,data:savedUser,message:"User created successfully"});
  } catch (error) {
    return res.status(500).json({ status:false,message: 'Internal server error' });
  }
};


export { createUser };