const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const NGO = require('../models/NGO');

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user based on type (donor or ngo)
    let user = null;
    if (decoded.type === 'donor') {
      user = await Donor.findById(decoded.id);
    } else if (decoded.type === 'ngo') {
      user = await NGO.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid, user not found' 
      });
    }

    req.user = user;
    req.userType = decoded.type;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication',
      error: error.message 
    });
  }
};

// Middleware to check if user is a donor
const isDonor = (req, res, next) => {
  if (req.userType !== 'donor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Donor access required.' 
    });
  }
  next();
};

// Middleware to check if user is an NGO
const isNGO = (req, res, next) => {
  if (req.userType !== 'ngo') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. NGO access required.' 
    });
  }
  next();
};

module.exports = {
  authenticate,
  isDonor,
  isNGO
};

