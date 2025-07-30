import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      // <--- MODIFIED THIS BLOCK
      type: String,
      unique: true,
      sparse: true, // <--- IMPORTANT: Allows multiple documents with null/undefined phoneNumber
      required: false, // <--- IMPORTANT: Makes phoneNumber optional
    },
  },
  { timestamps: true }
); // Added timestamps for good practice

// Consistent naming: Model name should start with uppercase
const User = mongoose.model("User", userSchema);
export default User;
