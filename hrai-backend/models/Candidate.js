const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    // Who uploaded this candidate
    userId: {
      type: String, // Firebase UID
      required: true,
    },
    // Parsed resume data from Claude
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    current_role: { type: String, default: '' },
    experience_years: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    education: { type: String, default: '' },
    // Cloudflare R2 resume path properties
    resumeKey: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
