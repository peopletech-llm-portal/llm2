import User from "../models/User.js";

// Role-based access control middleware
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Check if user can manage other users
export const canManageUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUserId = req.params.id || req.body.userId;
    
    if (!targetUserId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Main Admin can manage everyone
    if (currentUser.role === 'MAIN_ADMIN') {
      req.targetUser = targetUser;
      return next();
    }

    // Sub Admin can only manage interns
    if (currentUser.role === 'SUB_ADMIN' && targetUser.role === 'INTERN') {
      req.targetUser = targetUser;
      return next();
    }

    // Users can manage themselves
    if (currentUser._id.toString() === targetUser._id.toString()) {
      req.targetUser = targetUser;
      return next();
    }

    return res.status(403).json({ 
      message: "You don't have permission to manage this user" 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check if user can create users with specific role
export const canCreateRole = (req, res, next) => {
  const { role } = req.body;
  const currentUserRole = req.user.role;

  // Main Admin can create any role
  if (currentUserRole === 'MAIN_ADMIN') {
    return next();
  }

  // Sub Admin can only create interns
  if (currentUserRole === 'SUB_ADMIN' && role === 'INTERN') {
    return next();
  }

  return res.status(403).json({ 
    message: "You don't have permission to create users with this role",
    allowed: currentUserRole === 'SUB_ADMIN' ? ['INTERN'] : []
  });
};
