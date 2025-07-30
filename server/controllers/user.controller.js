import User from "../models/user.model.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecretkey";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 3600000, // 1 hour
  });
};

export const signup = async (req, res) => {
  // Renamed from signupUser to signup for consistency with frontend
  try {
    const { name, email, password, phoneNumber } = req.body; // phoneNumber is now optional

    // Basic server-side validation (always replicate/enhance frontend validation)
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8) {
      // Consistent with frontend
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    // Check for existing email first
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ message: "A user with that email already exists." }); // 409 Conflict for duplicates
    }

    // Only check phone number uniqueness if it's provided (because it's optional and sparse)
    if (phoneNumber) {
      // If frontend sends empty string and schema is sparse, this will be skipped
      const existingUserByPhoneNumber = await User.findOne({ phoneNumber });
      if (existingUserByPhoneNumber) {
        return res
          .status(409)
          .json({ message: "A user with that phone number already exists." }); // 409 Conflict
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // Store phoneNumber as null if empty, or omit if you prefer 'undefined' based on schema
      // Since it's optional and sparse, an empty string `""` will work if you prefer storing empty strings.
      // If you want to explicitly save as `null` if empty from frontend, use: `phoneNumber: phoneNumber || null`
      phoneNumber: phoneNumber || null, // Ensure `null` for optional empty
    });
    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res); // Generate and set token in cookies

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: newUser._id, // Use _id from Mongoose document
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Signup error (server-side):", error); // Improved logging
    // Specific MongoDB duplicate key error check (fallback, as findOne should catch most)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res.status(409).json({
        message: `A user with that ${field} (${value}) already exists.`,
      });
    }
    res.status(500).json({ message: "Internal Server Error during signup." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    generateTokenAndSetCookie(user._id, res); // Generate and set token in cookies
    // Optionally, you can return user data without password
    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("error: " + error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwtToken");
  res.status(200).json({ message: "Logout Successful" });
};

export const protect = (req, res, next) => {
  const token = req.cookies.jwtToken;
  // console.log("Protect Middleware Hit."); // Confirm middleware is running
  // console.log("Token from cookie:", token); // <--- Add this!

  if (!token) {
    // console.log("No token found in cookie.");
    return res.status(401).json({ message: "Not Authorized, No token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Use process.env.JWT_SECRET directly here
    // console.log("Decoded Token:", decoded); // What's in the token?
    req.userId = decoded.userId; // Ensure this matches what you sign in login/signup
    // console.log("req.userId set to:", req.userId); // What userId is being set?
    next();
  } catch (error) {
    // console.error("Token verification failed in protect middleware:", error); // Detailed error log
    res.clearCookie("jwtToken"); // Clear potentially invalid token
    res.status(401).json({ message: "Not authorized, token failed." });
  }
};
//protected route example
export const getProfile = async (req, res) => {
  try {
    // console.log("GET /user/profile route hit - req.userId:", req.userId); // Add this log!
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." }); // This 404 is from the controller
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error (server-side):", error);
    // Important: Handle Mongoose CastError for invalid IDs here
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format." });
    }
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

export const getUserProfileUsingId = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User profile fetched successfully",
      user: user,
    });
  } catch (error) {
    console.log("error: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
