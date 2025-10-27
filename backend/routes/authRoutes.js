import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireRole, canCreateRole } from "../middleware/roleMiddleware.js";
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
    req.user = decoded; // attach user info { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

// =======================
// Register Route (Admin only)
// =======================
router.post("/register", authMiddleware, canCreateRole, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      employeeId, 
      companyEmail, 
      personalEmail, 
      contactNumber, 
      username,
      gender,
      phoneNumber,
      dateOfBirth
    } = req.body;

    // Validate required fields based on role
    if (role === 'INTERN') {
      if (!employeeId || !companyEmail || !contactNumber || !username) {
        return res.status(400).json({ 
          message: "Employee ID, company email, contact number, and username are required for interns" 
        });
      }
    }

    if (role === 'OUTER') {
      if (!gender || !phoneNumber || !dateOfBirth) {
        return res.status(400).json({ 
          message: "Gender, phone number, and date of birth are required for outer users" 
        });
      }
    }

    // Check for duplicate email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) return res.status(400).json({ message: "Email already registered" });

    // Check for duplicate username if provided
    if (username) {
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) return res.status(400).json({ message: "Username already taken" });
    }

    // Check for duplicate mobile number if provided
    if (contactNumber) {
      const existingUserByMobile = await User.findOne({ contactNumber });
      if (existingUserByMobile) return res.status(400).json({ message: "Mobile number already registered" });
    }

    // Check for duplicate phone number for outer users
    if (phoneNumber) {
      const existingUserByPhone = await User.findOne({ phoneNumber });
      if (existingUserByPhone) return res.status(400).json({ message: "Phone number already registered" });
    }

    // Check existing employee ID for interns
    if (role === 'INTERN') {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) return res.status(400).json({ message: "Employee ID already exists" });
      
      // Check for duplicate company email for interns
      if (companyEmail) {
        const existingCompanyEmail = await User.findOne({ companyEmail });
        if (existingCompanyEmail) return res.status(400).json({ message: "Company email already registered" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      createdBy: req.user.id
    };

    // Add intern-specific fields
    if (role === 'INTERN') {
      userData.employeeId = employeeId;
      userData.companyEmail = companyEmail;
      userData.personalEmail = personalEmail;
      userData.contactNumber = contactNumber;
      userData.username = username;
    }

    // Add outer-specific fields
    if (role === 'OUTER') {
      userData.gender = gender;
      userData.phoneNumber = phoneNumber;
      userData.dateOfBirth = dateOfBirth;
    }

    const user = new User(userData);
    await user.save();

    // Update interns.json if it's an intern
    if (role === 'INTERN') {
      await updateInternsFile();
    }

    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Login Route
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password, loginType } = req.body;

    let user;
    
    // For interns, allow login with company email or contact number
    if (loginType === 'intern') {
      user = await User.findOne({
        $or: [
          { companyEmail: email },
          { contactNumber: email }
        ],
        role: 'INTERN'
      });
    } else if (loginType === 'outer') {
      // For outer users, use email and numeric DOB (ddmmyyyy) as password
      user = await User.findOne({ 
        email,
        role: 'OUTER'
      });
    } else {
      // For admins, use regular email
      user = await User.findOne({ 
        email,
        role: { $in: ['MAIN_ADMIN', 'SUB_ADMIN'] }
      });
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token with role
    const jwtSecret = process.env.JWT_SECRET || "default-secret-key-for-development";
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role, 
        email: user.email,
        employeeId: user.employeeId,
        username: user.username
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Get Profile (Protected)
// =======================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // hide password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// =======================
// Get all users (Admin only)
// =======================
router.get("/users", authMiddleware, requireRole(['MAIN_ADMIN', 'SUB_ADMIN']), async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    let query = {};
    
    // Sub admins can only see interns
    if (currentUser.role === 'SUB_ADMIN') {
      query.role = 'INTERN';
    }
    
    // Main admins can see all users except other main admins
    if (currentUser.role === 'MAIN_ADMIN') {
      query.role = { $in: ['SUB_ADMIN', 'INTERN', 'OUTER'] };
    }
    
    const users = await User.find(query).select("-password").populate('createdBy', 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =======================
// Download interns.json
// =======================
router.get("/interns/download", authMiddleware, requireRole(['MAIN_ADMIN', 'SUB_ADMIN']), async (req, res) => {
  try {
    const { getInternsFile } = await import("../utils/internFileUpdater.js");
    const data = await getInternsFile();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=interns.json');
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
