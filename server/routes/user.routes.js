import express from "express";

import {
  getUserProfileUsingId,
  login,
  signup,
} from "../controllers/user.controller.js";
import { get } from "mongoose";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/userById", getUserProfileUsingId);
export default router;
