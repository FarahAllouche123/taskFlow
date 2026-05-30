const express = require("express");
const router  = express.Router();
const {
  getTasks, getTask, createTask, updateTask, deleteTask, clearCompleted,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// All task routes require authentication
router.use(protect);

router.route("/")
  .get(getTasks)
  .post(createTask);

router.delete("/completed/all", clearCompleted);

router.route("/:id")
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;