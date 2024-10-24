const JWT = require("jsonwebtoken");

// Middleware to verify JWT and check user roles
const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization");
    
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = JWT.verify(token, "guyfeoufyfew8dsc");
      req.user = decoded;

      // If roles are defined, check if the user has the required role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied: insufficient permissions" });
      }

      next();
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};

module.exports = verifyToken;
