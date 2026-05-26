require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = 3001;

// Enable CORS for local Vite development server
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// Configure multer to keep uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Anthropic client using the environment variable
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    let resumeText = '';
    
    // Parse PDF
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      resumeText = data.text;
    } else {
      // Fallback for DOC/DOCX/TXT processing (requires appropriate parser like mammoth for real DOCX)
      resumeText = req.file.buffer.toString('utf-8');
    }

    const prompt = `You are a resume parser. Extract the following 
information from this resume and return ONLY a JSON 
object with no extra text, no markdown, no backticks.

Return exactly this structure:
{
  "name": string,
  "current_role": string,
  "experience_years": string,
  "skills": array of strings,
  "education": string,
  "email": string
}

If any field is not found, return empty string or empty array. Never return null.

Resume Text:
${resumeText}`;

    // Call the Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const rawOutput = response.content[0].text.trim();
    
    // Safety fallback in case Claude includes markdown backticks despite instructions
    const cleanOutput = rawOutput.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    const parsedData = JSON.parse(cleanOutput);
    
    return res.json(parsedData);
    
  } catch (error) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ error: 'Failed to process resume.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`HR.ai API backend running at http://localhost:${port}`);
});
