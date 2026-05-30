const Candidate = require('../models/Candidate');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const PLANS = require('../config/plans');
const { getSignedResumeUrl, deleteResume, uploadResume } = require('../services/r2Service');

/**
 * GET /api/candidates
 * Get all candidates uploaded by the logged-in user.
 */
const getCandidates = async (req, res) => {
  try {
    const filter = { userId: req.user.uid };

    const candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 });

    // Generate secure pre-signed URLs for each candidate dynamically
    const candidatesWithUrls = await Promise.all(
      candidates.map(async (candidate) => {
        let candidateObj = candidate.toObject();
        if (candidate.resumeKey) {
          candidateObj.resumeUrl = await getSignedResumeUrl(candidate.resumeKey);
        }
        return candidateObj;
      })
    );

    return res.status(200).json({ candidates: candidatesWithUrls });
  } catch (err) {
    console.error('[getCandidates] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/candidates/:id
 * Get a single candidate by ID.
 */
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    let candidateObj = candidate.toObject();
    if (candidate.resumeKey) {
      candidateObj.resumeUrl = await getSignedResumeUrl(candidate.resumeKey);
    }

    return res.status(200).json({ candidate: candidateObj });
  } catch (err) {
    console.error('[getCandidate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/candidates/:id/resume
 * Get a fresh secure pre-signed download URL for a candidate's resume.
 */
const getCandidateResumeUrl = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (!candidate.resumeKey) {
      return res.status(404).json({ error: 'No resume stored for this candidate' });
    }

    const resumeUrl = await getSignedResumeUrl(candidate.resumeKey);
    return res.status(200).json({ resumeUrl });
  } catch (err) {
    console.error('[getCandidateResumeUrl] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/candidates/:id
 * Delete a candidate by ID.
 */
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Delete the file from Cloudflare R2
    if (candidate.resumeKey) {
      await deleteResume(candidate.resumeKey);
    }

    // Remove candidate from MongoDB
    await Candidate.deleteOne({ _id: candidate._id });

    return res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('[deleteCandidate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/candidates/:id
 * Update a candidate by ID.
 */
const updateCandidate = async (req, res) => {
  try {
    const allowedUpdates = {
      name: req.body.name,
      current_role: req.body.current_role,
      experience_years: req.body.experience_years,
      skills: req.body.skills,
      education: req.body.education,
      email: req.body.email,
      notes: req.body.notes,
      stage: req.body.stage,
    };

    Object.keys(allowedUpdates).forEach(
      key => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const candidate = await Candidate.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      allowedUpdates,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    return res.status(200).json({ candidate });
  } catch (err) {
    console.error('[updateCandidate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/candidates
 * Create a new candidate, handling optional multipart/form-data resume upload.
 */
const createCandidate = async (req, res) => {
  try {
    let r2Key = '';
    let r2Url = '';

    // If a resume file is provided, upload it to Cloudflare R2
    if (req.file) {
      try {
        // Read file from the path multer saved it to temporarily
        const fs = require('fs');
        const dataBuffer = fs.readFileSync(req.file.path);
        
        const uploadResult = await uploadResume(dataBuffer, req.file.originalname, req.file.mimetype);
        r2Key = uploadResult.key;
        r2Url = uploadResult.url;
        
        // Clean up temp file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('[createCandidate] R2 Upload Error:', uploadError.message);
        if (req.file && require('fs').existsSync(req.file.path)) {
          require('fs').unlinkSync(req.file.path);
        }
      }
    }

    let skillsArray = [];
    if (req.body.skills) {
      if (typeof req.body.skills === 'string') {
        try {
          skillsArray = JSON.parse(req.body.skills);
        } catch {
          skillsArray = req.body.skills.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(req.body.skills)) {
        skillsArray = req.body.skills;
      }
    }

    const newCandidate = await Candidate.create({
      userId: req.user.uid,
      name: req.body.name || 'Unknown',
      current_role: req.body.current_role || req.body.role || '',
      experience_years: req.body.experience_years !== undefined ? Number(req.body.experience_years) : 0,
      skills: skillsArray,
      education: req.body.education || '',
      email: req.body.email || '',
      stage: req.body.stage || 'In Review',
      resumeKey: r2Key,
      resumeUrl: r2Url,
    });

    return res.status(201).json({ candidate: newCandidate });
  } catch (err) {
    console.error('[createCandidate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/candidates/bulk
 * Bulk create candidates from CSV data.
 */
const bulkCreateCandidates = async (req, res) => {
  try {
    const candidatesData = req.body.candidates;
    if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
      return res.status(400).json({ error: 'No candidates provided' });
    }

    const userId = req.user.uid;

    // --- Rate Limiting Logic ---
    const subscription = await Subscription.findOne({ userId });
    const planId = subscription?.plan || 'free';
    
    let maxCandidatesPerFile = 20;
    let maxFilesPerDay = 1;

    if (planId === 'starter') {
      maxCandidatesPerFile = 100;
      maxFilesPerDay = 5;
    } else if (planId === 'pro') {
      maxCandidatesPerFile = 500;
      maxFilesPerDay = Infinity;
    }

    if (candidatesData.length > maxCandidatesPerFile) {
      return res.status(400).json({ error: `Your ${planId} plan allows a maximum of ${maxCandidatesPerFile} candidates per CSV import.` });
    }

    const user = await User.findOne({ firebaseUid: userId });
    const today = new Date().toISOString().split('T')[0];
    const lastImportDate = user?.lastCsvImportDate ? user.lastCsvImportDate.toISOString().split('T')[0] : null;

    let importsToday = user?.csvImportsToday || 0;
    if (lastImportDate !== today) {
      importsToday = 0; // Reset counter for a new day
    }

    if (importsToday >= maxFilesPerDay) {
      return res.status(429).json({ error: `Your ${planId} plan allows a maximum of ${maxFilesPerDay} CSV imports per day.` });
    }
    // --- End Rate Limiting Logic ---

    const newCandidates = [];
    const skippedEmails = [];

    // Fetch existing emails to avoid duplicates
    const existingCandidates = await Candidate.find({ userId }, 'email');
    const existingEmails = new Set(existingCandidates.map(c => c.email.toLowerCase()).filter(e => e));

    for (const data of candidatesData) {
      const email = (data.email || '').trim().toLowerCase();
      
      // Skip if email already exists
      if (email && existingEmails.has(email)) {
        skippedEmails.push(email);
        continue;
      }

      if (email) {
        existingEmails.add(email);
      }

      let skillsArray = [];
      if (data.skills) {
        if (typeof data.skills === 'string') {
          skillsArray = data.skills.split(',').map(s => s.trim());
        } else if (Array.isArray(data.skills)) {
          skillsArray = data.skills;
        }
      }

      newCandidates.push({
        userId,
        name: data.name || 'Unknown',
        email: data.email || '',
        current_role: data.current_role || '',
        experience_years: data.experience_years ? Number(data.experience_years) : 0,
        skills: skillsArray,
        education: data.education || '',
        stage: 'In Review',
        resumeUrl: data.resume_link || '', // The external link!
      });
    }

    if (newCandidates.length > 0) {
      await Candidate.insertMany(newCandidates);
      
      // Update limits after successful import
      await User.findOneAndUpdate(
        { firebaseUid: userId },
        { 
          csvImportsToday: importsToday + 1,
          lastCsvImportDate: new Date()
        }
      );
    }

    return res.status(201).json({
      message: `Successfully imported ${newCandidates.length} candidates.`,
      importedCount: newCandidates.length,
      skippedEmails
    });
  } catch (err) {
    console.error('[bulkCreateCandidates] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCandidates,
  getCandidate,
  getCandidateResumeUrl,
  updateCandidate,
  deleteCandidate,
  createCandidate,
  bulkCreateCandidates
};
