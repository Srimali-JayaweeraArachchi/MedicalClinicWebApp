const express = require("express");
const { verifyAdmin } = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController"); // Import adminController
const User = require('../models/user');

const router = express.Router();

// Admin login route
router.post("/login", adminController.adminLogin);

// Middleware to verify admin access
router.use(verifyAdmin);

// Admin: Get all users
//router.get("/users", adminController.getUsers);

router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
// Admin: Get user by ID
router.get("/user/:id", adminController.getUserById);

// Admin: Update user info
router.put("/user/:id", adminController.updateUser);

// Admin: Delete user
router.delete("/user/:id", adminController.deleteUser);

// Admin: Block a user
router.put("/user/block/:id", adminController.blockUser);

// Admin: Unblock a user
router.put("/user/unblock/:id", adminController.unblockUser);

module.exports = router;
