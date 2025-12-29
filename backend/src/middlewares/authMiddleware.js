const jwt = require('jsonwebtoken');
const User = require('../models/User')

const protect = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Not authorised' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
