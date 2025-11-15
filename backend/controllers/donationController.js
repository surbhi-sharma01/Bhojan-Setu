const Donation = require('../models/Donation');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Donor)
exports.createDonation = async (req, res) => {
  try {
    const {
      foodType,
      quantity,
      description,
      pickupAddress,
      pickupDate,
      contactPhone,
      notes
    } = req.body;

    // Check if pickup date is in the future
    const pickupDateTime = new Date(pickupDate);
    if (pickupDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date must be in the future'
      });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      foodType,
      quantity,
      description,
      pickupAddress,
      pickupDate: pickupDateTime,
      contactPhone,
      notes,
      status: 'pending'
    });

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email phone address role');

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: { donation: populatedDonation }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating donation',
      error: error.message
    });
  }
};

// @desc    Get all available donations (for NGOs)
// @route   GET /api/donations/available
// @access  Private (NGO)
exports.getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'pending' })
      .populate('donor', 'name email phone address role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: { donations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available donations',
      error: error.message
    });
  }
};

// @desc    Get all donations by donor
// @route   GET /api/donations/my-donations
// @access  Private (Donor)
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('ngo', 'name email phone address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: { donations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
      error: error.message
    });
  }
};

// @desc    Assign/Claim donation to NGO
// @route   PUT /api/donations/:id/assign
// @access  Private (NGO)
exports.assignDonation = async (req, res) => {
  try {
    // Find donation and populate donor to check availability
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone address role');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if donation is still available
    if (donation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Donation is no longer available. Current status: ${donation.status}`,
        currentStatus: donation.status
      });
    }

    // Check if donation has already been claimed by another NGO
    if (donation.ngo && donation.ngo.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'This donation has already been claimed by another NGO'
      });
    }

    // Mark as claimed by this NGO
    donation.ngo = req.user._id;
    donation.status = 'assigned';
    donation.claimedAt = new Date();

    await donation.save();

    // Populate with full donor and NGO information
    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email phone address role')
      .populate('ngo', 'name email phone address');

    // Return donor contact information in response
    const donorInfo = {
      name: populatedDonation.donor.name,
      phone: populatedDonation.donor.phone || populatedDonation.contactPhone,
      email: populatedDonation.donor.email,
      address: populatedDonation.donor.address,
      contactPhone: populatedDonation.contactPhone,
      pickupAddress: populatedDonation.pickupAddress
    };

    res.json({
      success: true,
      message: 'Donation claimed successfully',
      data: { 
        donation: populatedDonation,
        donorContact: donorInfo,
        claimedAt: donation.claimedAt
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error claiming donation',
      error: error.message
    });
  }
};

// @desc    Update donation status (collected/delivered)
// @route   PUT /api/donations/:id/status
// @access  Private (NGO)
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if NGO owns this donation
    if (donation.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own claimed donations.'
      });
    }

    // Validate status transition
    const validStatuses = ['assigned', 'collected', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    // Update status and timestamps
    donation.status = status;
    if (status === 'collected' && !donation.collectedAt) {
      donation.collectedAt = new Date();
    }
    if (status === 'delivered' && !donation.completedAt) {
      donation.completedAt = new Date();
    }

    await donation.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email phone address role')
      .populate('ngo', 'name email phone address');

    res.json({
      success: true,
      message: `Donation marked as ${status}`,
      data: { donation: populatedDonation }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid donation ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating donation status',
      error: error.message
    });
  }
};
