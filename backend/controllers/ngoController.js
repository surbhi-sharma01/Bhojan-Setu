const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const generateToken = require('../utils/generateToken');

// @desc    Register a new NGO
// @route   POST /api/ngos/register
// @access  Public
exports.registerNGO = async (req, res) => {
  try {
    const { name, email, password, phone, address, registrationNumber } = req.body;

    // Check if NGO already exists
    const ngoExists = await NGO.findOne({ email });
    if (ngoExists) {
      return res.status(400).json({
        success: false,
        message: 'NGO with this email already exists'
      });
    }

    // Create NGO
    const ngo = await NGO.create({
      name,
      email,
      password,
      phone,
      address,
      registrationNumber
    });

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.status(201).json({
      success: true,
      message: 'NGO registered successfully',
      data: {
        ngo,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering NGO',
      error: error.message
    });
  }
};

// @desc    Login NGO
// @route   POST /api/ngos/login
// @access  Public
exports.loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find NGO and include password field
    const ngo = await NGO.findOne({ email }).select('+password');
    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await ngo.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        ngo,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get NGO profile
// @route   GET /api/ngos/profile
// @access  Private (NGO)
exports.getNGOProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user._id);
    res.json({
      success: true,
      data: { ngo }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Get all claimed donations by NGO
// @route   GET /api/ngos/claimed-donations
// @access  Private (NGO)
exports.getClaimedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ 
      ngo: req.user._id,
      status: { $in: ['assigned', 'collected', 'delivered'] }
    })
      .populate('donor', 'name email phone address role')
      .sort({ claimedAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: { donations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claimed donations',
      error: error.message
    });
  }
};

