/**
 * Middleware to check if the authenticated user has one of the specified roles.
 * @param {Array<string>} roles - An array of roles that are permitted to access the route.
 * @returns {Function} - A middleware function that checks the user's role.
 * @throws {Object} - Responds with a 403 status and an error message if the user does not have permission.
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = { checkRole };
