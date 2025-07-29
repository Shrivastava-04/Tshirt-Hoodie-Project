import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user1 = await User.findOne({ email });
    if (user1) {
      return res.status(400).json({ message: "User already exist" });
    }
    const createUser = await new User({
      name: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
    });
    createUser.save();
    res.status(201).json({
      message: "User Created Successfully",
      user: createUser,
    });
  } catch (error) {
    console.log("error: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    res.status(200).json({
      message: "Login Successful",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("error: " + error.message);
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
