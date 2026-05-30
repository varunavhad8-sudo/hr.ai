const multer = require('multer');

// Store files in RAM — accessible as req.file.buffer in route handlers
const storage = multer.memoryStorage();

// Reject anything that is not a PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

// Export the configured multer instance so routes choose the field name
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = uploadMiddleware;
