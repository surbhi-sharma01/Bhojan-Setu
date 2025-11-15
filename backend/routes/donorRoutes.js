const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const donorController = require('../controllers/donorController');
const { authenticate, isDonor } = require('../middleware/auth');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// @route   POST /api/donors/register
// @desc    Register a new donor
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('role').optional().isIn(['individual', 'restaurant', 'organization'])
  ],
  validate,
  donorController.registerDonor
);

// @route   POST /api/donors/login
// @desc    Login donor
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  donorController.loginDonor
);

// @route   GET /api/donors/profile
// @desc    Get donor profile
// @access  Private (Donor)
router.get('/profile', authenticate, isDonor, donorController.getDonorProfile);

module.exports = router;


