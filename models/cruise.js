import mongoose from 'mongoose';

const cruiseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true,
    default: 'Bangkok'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'THB'
  },
  duration: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    default: 'Bangkok'
  },
  features: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  images: {
    main: {
      type: String,
      required: true
    },
    gallery: [{
      type: String
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
cruiseSchema.index({ isActive: 1 });
cruiseSchema.index({ location: 1 });
cruiseSchema.index({ rating: -1 });

const Cruise = mongoose.models.Cruise || mongoose.model('Cruise', cruiseSchema);

export default Cruise;