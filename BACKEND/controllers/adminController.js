const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin login function
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin by email
        const admin = await User.findOne({ email, role: "Admin" });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, message: "Login successful!" });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Server error!" });
    }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Block a user
const blockUser = async (req, res) => {
  try {
    const blockedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    if (!blockedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User blocked successfully", user: blockedUser });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user", error });
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const unblockedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    if (!unblockedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User unblocked successfully", user: unblockedUser });
  } catch (error) {
    res.status(500).json({ message: "Error unblocking user", error });
  }
};

module.exports = {
  adminLogin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
};
