const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['individual', 'restaurant', 'organization'],
    default: 'individual'
  }
}, {
  timestamps: true
});

// Hash password before saving
donorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
donorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
donorSchema.methods.toJSON = function() {
  const donorObject = this.toObject();
  delete donorObject.password;
  return donorObject;
};

module.exports = mongoose.model('Donor', donorSchema);


