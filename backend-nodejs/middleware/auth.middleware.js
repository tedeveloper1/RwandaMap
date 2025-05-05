// authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Check if the role is present in the session (server-side verification)
  const role = req.session?.role;  // Assuming the role is stored in session

  if (!role) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Attach the role to the request object for further use
  req.user = { role };  
  next();
};

// adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  const userRole = req.user?.role;  // The role is passed from the authMiddleware

  if (userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
