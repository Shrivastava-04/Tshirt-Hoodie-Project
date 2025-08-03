import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  sizes: [
    {
      type: String,
      required: true,
    },
  ],
  varietyOfProduct: [
    {
      type: String,
      required: true,
    },
  ],
  colors: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    default: true,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  features: [
    {
      type: String,
      required: true,
    },
  ],
  specifications: {
    Material: { type: String, required: true },
    Weight: { type: String, required: true },
    Fit: { type: String, required: true },
    Care: { type: String, required: true },
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
