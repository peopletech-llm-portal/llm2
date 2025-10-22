// Role-based access control middleware
export const checkRole = (allowedRoles) => {
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

// Specific role checks
export const requireMainAdmin = checkRole(['MAIN_ADMIN']);
export const requireSubAdmin = checkRole(['SUB_ADMIN']);
export const requireIntern = checkRole(['INTERN']);
export const requireAdmin = checkRole(['MAIN_ADMIN', 'SUB_ADMIN']);
export const requireAnyRole = checkRole(['MAIN_ADMIN', 'SUB_ADMIN', 'INTERN']);
