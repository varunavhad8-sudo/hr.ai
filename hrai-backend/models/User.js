const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'hr_manager',
    },
    jobTitle: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    photoURL: {
      type: String,
      default: '',
    },
    total_lifetime_parses: {
      type: Number,
      default: 0,
    },
    csvImportsToday: {
      type: Number,
      default: 0,
    },
    lastCsvImportDate: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
