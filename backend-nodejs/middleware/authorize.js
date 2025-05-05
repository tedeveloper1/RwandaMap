// middlewares/authorize.js
module.exports = (roles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // Make sure `req.user` is populated by your auth middleware
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    };
  };
  