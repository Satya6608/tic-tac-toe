const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Token is missing!' });
    }
    if (token) {
      try {
        //decodes token id
        const decoded = jwt.verify(token, 'mainhusecretkey', async (err, user) => {
          if (err) {
              if (err.name === 'TokenExpiredError') {
                  return res.status(403).json({ message: 'Token has expired, please log in again.' });
              }
              return res.status(403).json({ message: 'Invalid token.' });
          }
          req.user = user;
          req.user = await User.findById(decoded.id).select("-password");
          next();
        })
      } catch (error) {
        res.status(401);
        throw new Error(error.message);
      }
    }
  };

  module.exports = { protect };