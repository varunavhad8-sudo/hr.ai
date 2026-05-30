const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { protect } = require('../middleware/auth');
const { getCandidates, getCandidate, getCandidateResumeUrl, updateCandidate, deleteCandidate, createCandidate, bulkCreateCandidates } = require('../controllers/candidateController');

// Ensure /tmp directory exists for disk storage
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Safely use diskStorage
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, tmpDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(protect);
router.get('/', getCandidates);
router.post('/bulk', bulkCreateCandidates);
router.post('/', (req, res, next) => {
  uploadMiddleware.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, createCandidate);
router.get('/:id', getCandidate);
router.get('/:id/resume', getCandidateResumeUrl);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

module.exports = router;
