const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHdlr = require("../middlewares/asyncHandler");
const User = require('../models/User');
const { v4: uuidv4 } = require("uuid");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHdlr(async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    referredByCode,
  } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const message = existingUser.email === email ? "Email already exists" : "Username already taken";
      return res.status(400).json({ success: false, message });
    }

    let referredByUser = null;
    if (referredByCode) {
      referredByUser = await User.findOne({ referralCode: referredByCode });
      if (!referredByUser) {
        return res.status(400).json({ success: false, message: "Invalid referral code" });
      }
    }

    const referralCode = uuidv4().split("-")[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      referredBy: referredByUser ? referredByUser._id : null,
      referralCode,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions);

    const userData = { id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, referralCode: user.referralCode, referredBy: user.referredBy, createdAt: user.createdAt };

    return res.status(201).json({ success: true, message: "Registered successfully", token, user: userData });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const login = asyncHdlr(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, cookieOptions);
  const userData = { id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, isAdmin: user.isAdmin, referralCode: user.referralCode, createdAt: user.createdAt };
  return res.status(200).json({ success: true, message: "Logged in successfully", user: userData });
});

const logout = asyncHdlr(async (_req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
  res.json({ success: true, message: "Logged out successfully" });
});

const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ status: "error", message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });
    res.json({ status: "success", user: { id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, isAdmin: user.isAdmin, referralCode: user.referralCode } });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ status: "error", message: "Error fetching user profile" });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    const referredIds = users.map((user) => user.referredBy).filter((id) => id);
    const referredUsers = await User.find({ _id: { $in: referredIds } }, { _id: 1, username: 1 });
    const referredMap = {};
    referredUsers.forEach((refUser) => { referredMap[refUser._id.toString()] = refUser.username; });
    const result = users.map((user) => ({ ...user._doc, referredBy: user.referredBy ? referredMap[user.referredBy.toString()] || null : null }));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) return res.status(400).json({ success: false, message: "All fields are required" });
    if (newPassword.trim() !== confirmNewPassword.trim()) return res.status(400).json({ success: false, message: "New passwords do not match" });
    if (currentPassword === newPassword) return res.status(400).json({ success: false, message: "New password cannot be the same as the current password" });
    if (!req.user || !req.user._id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!user.password) return res.status(400).json({ success: false, message: "Password not set for this account" });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Current password is incorrect" });
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { register, login, logout, verifyToken, GetAllUsers, changePassword };
