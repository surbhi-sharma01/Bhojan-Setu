const jwt = require('jsonwebtoken');

const generateToken = (userId, userType) => {
  return jwt.sign(
    { 
      id: userId,
      type: userType 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
};

module.exports = generateToken;


