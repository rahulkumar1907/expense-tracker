import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 100,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
    },
  },
  { timestamps: true } // This option adds createdAt and updatedAt fields automatically
);

export default mongoose.model("User", userSchema);
