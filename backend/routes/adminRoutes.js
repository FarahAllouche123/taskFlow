const express = require("express");
const router  = express.Router();
const { getAllUsers, getUserDetails, deleteUser, getGlobalStats } = require("../controllers/adminController");
const { protect }         = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// All admin routes need auth + admin check
router.use(protect, adminMiddleware);

router.get("/stats",        getGlobalStats);
router.get("/users",        getAllUsers);
router.get("/users/:id",    getUserDetails);
router.delete("/users/:id", deleteUser);

module.exports = router;