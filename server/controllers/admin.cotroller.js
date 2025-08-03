// backend/controllers/admin.controller.js
import User from "../models/user.model.js";
import Product from "../models/product.model.js"; // Assuming you have a Product model
import mongoose from "mongoose"; // For ObjectId validation

// --- PRODUCTS MANAGEMENT ---

// Get All Products (Admin)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.error("Admin: Error fetching all products:", error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// Get Single Product Details (Admin)
export const getProductDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from URL params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Admin: Error fetching product details:", error);
    res.status(500).json({ message: "Failed to fetch product details." });
  }
};

// Add New Product
export const addProduct = async (req, res) => {
  try {
    // You would typically handle image uploads with 'multer' before this.
    // For simplicity, we assume images are sent as an array of URLs for now.
    const {
      name,
      price,
      originalPrice,
      description,
      images,
      sizes,
      varietyOfProduct,
      colors,
      category,
      isNew,
      onSale,
      rating,
      reviews,
      features,
      specifications,
    } = req.body;

    // Basic validation (add more comprehensive validation as needed)
    if (
      !name ||
      !price ||
      !description ||
      !category ||
      !images ||
      images.length === 0 ||
      !sizes ||
      sizes.length === 0 ||
      !varietyOfProduct ||
      varietyOfProduct.length === 0 ||
      !colors ||
      colors.length === 0 ||
      !specifications ||
      !specifications.Material
    ) {
      return res
        .status(400)
        .json({ message: "Missing required product fields." });
    }

    const newProduct = new Product({
      name,
      price,
      originalPrice,
      description,
      images,
      sizes,
      varietyOfProduct,
      colors,
      category,
      isNew,
      onSale,
      rating,
      reviews,
      features,
      specifications,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Admin: Error adding product:", error);
    res.status(500).json({ message: "Failed to add product." });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res
      .status(200)
      .json({
        message: "Product deleted successfully!",
        product: deletedProduct,
      });
  } catch (error) {
    console.error("Admin: Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product." });
  }
};

// --- USERS MANAGEMENT ---

// Get All Users (Admin)
export const getAllUsersAdmin = async (req, res) => {
  try {
    // Fetch all users, but exclude sensitive info like password
    const users = await User.find({}).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Admin: Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// Get Single User Details (Admin)
export const getUserDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Admin: Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details." });
  }
};

// (Optional: Delete User - Implement if needed)
/*
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully!', user: deletedUser });
    } catch (error) {
        console.error('Admin: Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};
*/
