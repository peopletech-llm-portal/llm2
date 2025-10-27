import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log('Auth header received:', authHeader);
  const token = authHeader?.split(" ")[1];
  console.log('Extracted token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "default-secret-key-for-development";
    console.log('Using JWT secret:', jwtSecret);
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Decoded token:', decoded);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    console.error('Token validation error:', error.message);
    res.status(401).json({ message: "Token is not valid", details: error.message });
  }
};

export default authMiddleware;