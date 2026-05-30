const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Use Haiku — 10x cheaper than Sonnet. Sufficient for structured JSON extraction.
const MODEL = 'claude-haiku-4-5-20251001';

const parseResumeText = async (resumeText) => {
    if (process.env.BYPASS_AUTH === 'true') {
        console.log('[mockClaude] Sandbox mode active. Instantly parsing candidate via high-fidelity local mock...');
        return {
            name: "John Doe",
            current_role: "Senior Software Engineer",
            experience_years: 5,
            skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "CSS", "HTML"],
            education: "M.S. in Computer Science from Stanford University",
            email: "john.doe@example.com"
        };
    }

    // Truncate to 6000 chars — resumes don't need more, and this controls token cost
    const truncated = resumeText.slice(0, 6000);

    const message = await client.messages.create({
        model: MODEL,
        max_tokens: 512, // Structured JSON output never needs more than 512 tokens
        messages: [
            {
                role: 'user',
                content: `You are a resume parser. Extract the following fields from the resume text below and return ONLY a raw JSON object — no markdown, no code fences, no explanation, nothing else.

Fields to extract:
- name: full name of the candidate
- current_role: their current or most recent job title
- experience_years: total years of professional experience (number)
- skills: an array of up to 8 key skills
- education: highest education qualification (degree, field, institution)
- email: email address

Resume text:
"""
${truncated}
"""

Return ONLY the JSON object. Example format:
{"name":"...","current_role":"...","experience_years":0,"skills":["..."],"education":"...","email":"..."}`,
            },
        ],
    });

    // Extract JSON using regex first to catch it if there's any surrounding text
    let raw = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      raw = jsonMatch[0];
    } else {
      // Strip any accidental markdown code fences or backticks before parsing
      raw = raw.replace(/```[\s\S]*?```/g, (match) =>
        match.replace(/```(?:json)?/g, '').replace(/```/g, '')
      );
      raw = raw.replace(/`/g, '').trim();
    }

    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('[claudeService] JSON parsing failed:', e.message);
      return {
        name: "",
        current_role: "",
        experience_years: "",
        skills: [],
        education: "",
        email: ""
      };
    }
};

module.exports = { parseResumeText };

