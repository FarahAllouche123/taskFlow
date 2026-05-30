const User = require("../models/User");
const Task = require("../models/Task");

// @desc    Get all users with their task stats
// @route   GET /api/admin/users
// @access  Admin only
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const tasks = await Task.find({ user: user._id });
        return {
          id:        user._id,
          name:      user.name,
          email:     user.email,
          avatar:    user.avatar,
          createdAt: user.createdAt,
          stats: {
            total:      tasks.length,
            todo:       tasks.filter(t => t.status === "todo").length,
            inProgress: tasks.filter(t => t.status === "in_progress").length,
            completed:  tasks.filter(t => t.status === "completed").length,
            overdue:    tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed").length,
          },
        };
      })
    );

    res.json({ success: true, count: users.length, users: usersWithStats });
  } catch (error) { next(error); }
};

// @desc    Get one user + all their tasks
// @route   GET /api/admin/users/:id
// @access  Admin only
const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user: {
        id: user._id, name: user.name, email: user.email,
        avatar: user.avatar, createdAt: user.createdAt,
      },
      tasks,
    });
  } catch (error) { next(error); }
};

// @desc    Delete a user and all their tasks
// @route   DELETE /api/admin/users/:id
// @access  Admin only
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await Task.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "User and all their tasks deleted" });
  } catch (error) { next(error); }
};

// @desc    Get global stats
// @route   GET /api/admin/stats
// @access  Admin only
const getGlobalStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completed  = await Task.countDocuments({ status: "completed" });
    const inProgress = await Task.countDocuments({ status: "in_progress" });
    const todo       = await Task.countDocuments({ status: "todo" });

    res.json({
      success: true,
      stats: { totalUsers, totalTasks, completed, inProgress, todo },
    });
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, getUserDetails, deleteUser, getGlobalStats };