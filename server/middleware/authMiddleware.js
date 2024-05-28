const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // decodes token id
      const decoded = jwt.verify(token, 'mainhusecretkey', (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired, please log in again.' });
          }
          return res.status(403).json({ message: 'Invalid token.' });
        }
        return decoded;
      });
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };