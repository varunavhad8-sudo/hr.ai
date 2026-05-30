const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { checkUsage } = require('../middleware/checkUsage');

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

// POST / — upload a PDF resume (auth + usage check + multer + parse)
router.post('/', protect, checkUsage, (req, res, next) => {
  uploadMiddleware.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, parseResume);

module.exports = router;
