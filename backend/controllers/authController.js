const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) { next(error); }
};

// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) { next(error); }
};

// @route   GET /api/auth/me
const getMe = async (req, res) => {
  const user = req.user;
  // Task stats
  const all = await Task.find({ user: user._id });
  const stats = {
    total:      all.length,
    todo:       all.filter(t => t.status === "todo").length,
    inProgress: all.filter(t => t.status === "in_progress").length,
    completed:  all.filter(t => t.status === "completed").length,
    overdue:    all.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed").length,
  };
  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt },
    stats,
  });
};

// @route   PUT /api/auth/me  — update name, email, avatar
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const updates = {};
    if (name)   updates.name   = name;
    if (email)  updates.email  = email;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: "Profile updated", user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) { next(error); }
};

// @route   PUT /api/auth/password  — change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Both fields are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ success: false, message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) { next(error); }
};

module.exports = { register, login, getMe, updateProfile, changePassword };