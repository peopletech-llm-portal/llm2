import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireRole, canManageUser, canCreateRole } from "../middleware/roleMiddleware.js";
import { updateInternsFile } from "../utils/internFileUpdater.js";

const router = express.Router();

// =======================
// Middleware: Auth Check
// =======================
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const jwtSecret = process.env.JWT_SECRET || "default-secret-key-for-development";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

// =======================
// Get all users
// =======================
router.get("/users", authMiddleware, requireRole(['MAIN_ADMIN', 'SUB_ADMIN']), async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    let query = {};
    
    // Sub admins can only see interns
    if (currentUser.role === 'SUB_ADMIN') {
      query.role = 'INTERN';
    }
    
    const users = await User.find(query).select("-password").populate('createdBy', 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Get single user
// =======================
router.get("/users/:id", authMiddleware, canManageUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate('createdBy', 'name email');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Update user
// =======================
router.put("/users/:id", authMiddleware, canManageUser, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      employeeId, 
      companyEmail, 
      personalEmail, 
      contactNumber, 
      username 
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update intern-specific fields
    if (user.role === 'INTERN') {
      if (employeeId) user.employeeId = employeeId;
      if (companyEmail) user.companyEmail = companyEmail;
      if (personalEmail) user.personalEmail = personalEmail;
      if (contactNumber) user.contactNumber = contactNumber;
      if (username) user.username = username;
    }

    await user.save();

    // Update interns.json if it's an intern
    if (user.role === 'INTERN') {
      await updateInternsFile();
    }

    res.json({ 
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Delete user
// =======================
router.delete("/users/:id", authMiddleware, canManageUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasIntern = user.role === 'INTERN';
    await User.findByIdAndDelete(req.params.id);

    // Update interns.json if it was an intern
    if (wasIntern) {
      await updateInternsFile();
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Reset user password
// =======================
router.post("/users/:id/reset-password", authMiddleware, canManageUser, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Create Main Admin (only for initial setup)
// =======================
router.post("/create-main-admin", async (req, res) => {
  try {
    // Check if main admin already exists
    const existingMainAdmin = await User.findOne({ role: 'main_admin' });
    if (existingMainAdmin) {
      return res.status(400).json({ message: "Main admin already exists" });
    }

    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const mainAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'MAIN_ADMIN'
    });

    await mainAdmin.save();

    res.status(201).json({ 
      message: "Main admin created successfully",
      user: {
        id: mainAdmin._id,
        name: mainAdmin.name,
        email: mainAdmin.email,
        role: mainAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
