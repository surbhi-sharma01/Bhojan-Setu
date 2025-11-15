const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const donationController = require('../controllers/donationController');
const { authenticate, isDonor, isNGO } = require('../middleware/auth');

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

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private (Donor)
router.post(
  '/',
  authenticate,
  isDonor,
  [
    body('foodType').trim().notEmpty().withMessage('Food type is required'),
    body('quantity').trim().notEmpty().withMessage('Quantity is required'),
    body('pickupAddress').trim().notEmpty().withMessage('Pickup address is required'),
    body('pickupDate').isISO8601().withMessage('Please provide a valid pickup date'),
    body('contactPhone').trim().notEmpty().withMessage('Contact phone is required'),
    body('description').optional().trim(),
    body('notes').optional().trim()
  ],
  validate,
  donationController.createDonation
);

// @route   GET /api/donations/available
// @desc    Get all available donations (for NGOs)
// @access  Private (NGO)
router.get('/available', authenticate, isNGO, donationController.getAvailableDonations);

// @route   GET /api/donations/my-donations
// @desc    Get all donations by donor
// @access  Private (Donor)
router.get('/my-donations', authenticate, isDonor, donationController.getMyDonations);

// @route   PUT /api/donations/:id/assign
// @desc    Assign donation to NGO
// @access  Private (NGO)
router.put('/:id/assign', authenticate, isNGO, donationController.assignDonation);

// @route   PUT /api/donations/:id/status
// @desc    Update donation status (collected/delivered)
// @access  Private (NGO)
router.put(
  '/:id/status',
  authenticate,
  isNGO,
  [
    body('status').isIn(['assigned', 'collected', 'delivered'])
      .withMessage('Status must be one of: assigned, collected, delivered')
  ],
  validate,
  donationController.updateDonationStatus
);

module.exports = router;

