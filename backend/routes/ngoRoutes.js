const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ngoController = require('../controllers/ngoController');
const { authenticate, isNGO } = require('../middleware/auth');

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

// @route   POST /api/ngos/register
// @desc    Register a new NGO
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('NGO name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('registrationNumber').optional().trim()
  ],
  validate,
  ngoController.registerNGO
);

// @route   POST /api/ngos/login
// @desc    Login NGO
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  ngoController.loginNGO
);

// @route   GET /api/ngos/profile
// @desc    Get NGO profile
// @access  Private (NGO)
router.get('/profile', authenticate, isNGO, ngoController.getNGOProfile);

// @route   GET /api/ngos/claimed-donations
// @desc    Get all claimed donations by NGO
// @access  Private (NGO)
router.get('/claimed-donations', authenticate, isNGO, ngoController.getClaimedDonations);

module.exports = router;

