const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const WordExtractor = require('word-extractor');
const { parseResumeText } = require('../services/claudeService');
const Candidate = require('../models/Candidate');
const { incrementUsage } = require('../middleware/checkUsage');
const { uploadResume } = require('../services/r2Service');

/**
 * POST /api/parse-resume
 * Auth: Required
 * Middleware: multer (req.file contains the pdf), checkUsage (enforces parse limits)
 */
const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume PDF provided' });
    }

    const filePath = req.file.path;
    let pdfText = '';
    let r2Key = '';
    let r2Url = '';

    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      
      // 1. Read and parse file safely based on extension
      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer, { max: 3 });
        pdfText = pdfData.text;
      } else if (ext === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        pdfText = result.value;
      } else if (ext === '.doc') {
        const extractor = new WordExtractor();
        const extracted = await extractor.extract(filePath);
        pdfText = extracted.getBody();
      } else if (ext === '.txt' || ext === '.md' || ext === '.rtf' || ext === '.csv') {
        pdfText = fs.readFileSync(filePath, 'utf8');
      } else {
        console.log(`[parseResume] Unsupported text extraction for ${ext}, returning blank data.`);
        pdfText = ''; // e.g. images, other formats
      }

      // Clean up file immediately from local disk
      fs.unlinkSync(filePath);
    } catch (parseError) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      console.error('[parseResume] File Extraction Error:', parseError.message);
      if (process.env.BYPASS_AUTH === 'true') {
        console.log('[parseResume] Sandbox mode active. Falling back to simulated text extraction...');
        pdfText = 'Simulated resume text';
      } else {
        // Don't error out, just return blank so they can still save the file
        pdfText = '';
      }
    }

    let parsedData = {};
    if (pdfText && pdfText.trim()) {
      try {
        // 2. Extract structured data using Claude
        parsedData = await parseResumeText(pdfText);

        // 3. Increment usage counter now that we successfully parsed
        await incrementUsage(req.user.uid, req.month);
      } catch (aiError) {
        console.error('[parseResume] AI Parsing Error:', aiError.message);
        // We do NOT throw here. If AI fails (e.g. out of credits), 
        // we just return blank fields so the user can fill them manually!
      }
    }

    return res.status(200).json({
      name: parsedData.name || 'Unknown',
      current_role: parsedData.current_role || '',
      experience_years: Number(parsedData.experience_years) || 0,
      skills: parsedData.skills || [],
      education: parsedData.education || '',
      email: parsedData.email || ''
    });
  } catch (err) {
    console.error('[parseResume] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { parseResume };
