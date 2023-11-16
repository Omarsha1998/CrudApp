const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_hardcoded_jwt_secret';
const tokenBlacklist = new Set();

const verifyToken = (req, res, next) => {
  const token = req.header('authorization')?.split(' ')[1];

  if (!token) {
    return res.status(403).send('Access denied.');
  }

  if (tokenBlacklist.has(token)) {
    return res.status(401).send('Token expired or invalid.');
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send('Access denied. Admin privileges required.');
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
