const Donor = require('../models/Donor');
const generateToken = require('../utils/generateToken');

// @desc    Register a new donor
// @route   POST /api/donors/register
// @access  Public
exports.registerDonor = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Check if donor already exists
    const donorExists = await Donor.findOne({ email });
    if (donorExists) {
      return res.status(400).json({
        success: false,
        message: 'Donor with this email already exists'
      });
    }

    // Create donor
    const donor = await Donor.create({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'individual'
    });

    // Generate token
    const token = generateToken(donor._id, 'donor');

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully',
      data: {
        donor,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering donor',
      error: error.message
    });
  }
};

// @desc    Login donor
// @route   POST /api/donors/login
// @access  Public
exports.loginDonor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find donor and include password field
    const donor = await Donor.findOne({ email }).select('+password');
    if (!donor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await donor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(donor._id, 'donor');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        donor,
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

// @desc    Get donor profile
// @route   GET /api/donors/profile
// @access  Private (Donor)
exports.getDonorProfile = async (req, res) => {
  try {
    const donor = await Donor.findById(req.user._id);
    res.json({
      success: true,
      data: { donor }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};


