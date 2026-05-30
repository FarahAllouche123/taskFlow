const Task = require("../models/Task");

// @desc    Get all tasks for logged-in user (with filter & sort)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = "createdAt", sortDir = "desc" } = req.query;

    const filter = { user: req.user._id };

    if (status && status !== "all")   filter.status   = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) {
      filter.title = { $regex: `^${search}`, $options: "i" };
    }

    const sortOrder = sortDir === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sortOptions);

    // Stats summary
    const all = await Task.find({ user: req.user._id });
    const stats = {
      total:      all.length,
      todo:       all.filter(t => t.status === "todo").length,
      inProgress: all.filter(t => t.status === "in_progress").length,
      completed:  all.filter(t => t.status === "completed").length,
      overdue:    all.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed").length,
    };

    res.json({ success: true, count: tasks.length, stats, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline, priority, status, tags } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || "",
      deadline:    deadline || null,
      priority:    priority || "medium",
      status:      status  || "todo",
      tags:        tags    || [],
    });

    res.status(201).json({ success: true, message: "Task created", task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task updated", task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all completed tasks
// @route   DELETE /api/tasks/completed/all
// @access  Private
const clearCompleted = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, status: "completed" });
    res.json({ success: true, message: `${result.deletedCount} completed tasks deleted` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, clearCompleted };