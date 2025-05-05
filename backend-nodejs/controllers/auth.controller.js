const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { getCoordinate } = require('../utils/coordinates');

// Register new user
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password, phone, location, role } = req.body;

  try {
    const { latitude, longitude } = await getCoordinate(location.district, location.sector);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      location: { ...location, latitude, longitude },
      role: role || 'user',
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Store user details in the session
    req.session.user = {
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, role: user.role, id: user._id }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Role-based authorization middleware
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    // The role should be in req.session.user if the user is logged in
    const userRole = req.session?.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }

    next();
  };
};

