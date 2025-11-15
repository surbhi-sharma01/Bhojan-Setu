const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: [true, 'Donor is required']
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    default: null
  },
  foodType: {
    type: String,
    required: [true, 'Food type is required'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  pickupAddress: {
    type: String,
    required: [true, 'Pickup address is required'],
    trim: true
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'collected', 'delivered', 'cancelled'],
    default: 'pending'
  },
  collectedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  claimedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ ngo: 1, status: 1 });
donationSchema.index({ status: 1, pickupDate: 1 });

module.exports = mongoose.model('Donation', donationSchema);

