import mongoose, { Schema } from "mongoose";

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
      sparse: true, // <--- IMPORTANT: Allows multiple documents with null/undefined phoneNumber
      required: false, // <--- IMPORTANT: Makes phoneNumber optional
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cartItem: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
          default: "S",
        },
      },
    ],
  },
  { timestamps: true }
); // Added timestamps for good practice

// Consistent naming: Model name should start with uppercase
const User = mongoose.model("User", userSchema);
export default User;
