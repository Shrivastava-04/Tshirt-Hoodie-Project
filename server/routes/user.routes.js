import express from "express";
import jwt from "jsonwebtoken"; // <--- ADD THIS
import User from "../models/user.model.js"; // <--- ADD THIS
// import { JWT_SECRET } from "../controllers/user.controller.js"; // <--- If JWT_SECRET is not globally defined or imported

import {
  getProfile,
  getUserProfileUsingId,
  login,
  logout,
  protect,
  signup,
} from "../controllers/user.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/userById", getUserProfileUsingId);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
export default router;
