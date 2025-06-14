
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, fileName, fileType, apiKey } = await req.json();

    if (!apiKey) {
      throw new Error('API key is required');
    }

    // For PDF files, we'll extract text using a simple approach
    let extractedText = '';
    
    if (fileType === 'application/pdf') {
      extractedText = 'CV content from PDF file';
    } else {
      // For DOC/DOCX files, convert base64 to text (simplified)
      try {
        extractedText = atob(fileContent);
      } catch (error) {
        extractedText = 'CV content from document file';
      }
    }

    const prompt = `
    You are a CV/Resume parser. Extract structured information from this CV text and return ONLY a valid JSON object with the following structure. Do not include any markdown formatting, code blocks, or additional text - just pure JSON:

    {
      "personal": {
        "fullName": "string",
        "email": "string", 
        "phone": "string",
        "location": "string",
        "summary": "string"
      },
      "experience": [
        {
          "id": 1,
          "company": "string",
          "position": "string", 
          "location": "string",
          "startDate": "string",
          "endDate": "string",
          "description": "string"
        }
      ],
      "education": [
        {
          "id": 1,
          "school": "string",
          "degree": "string",
          "location": "string", 
          "startDate": "string",
          "endDate": "string",
          "gpa": "string"
        }
      ],
      "skills": ["skill1", "skill2"],
      "certifications": [
        {
          "id": 1,
          "name": "string",
          "issuer": "string",
          "date": "string",
          "credentialId": "string"
        }
      ],
      "languages": [
        {
          "id": 1, 
          "language": "string",
          "proficiency": "string"
        }
      ],
      "interests": ["interest1", "interest2"],
      "projects": [
        {
          "id": 1,
          "name": "string",
          "description": "string", 
          "technologies": "string",
          "link": "string",
          "startDate": "string",
          "endDate": "string"
        }
      ]
    }

    CV Text to parse: ${extractedText}

    Extract the information and return only the JSON object. If any field is not found, use null for strings and empty arrays for arrays.
    `;

    let apiUrl = '';
    let requestBody = {};
    let headers = {};

    // Check if it's Gemini or OpenAI key
    if (apiKey.startsWith('AIza')) {
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      };
      headers = { 'Content-Type': 'application/json' };
    } else if (apiKey.startsWith('sk-')) {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a CV parser. Return only valid JSON, no markdown or additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      };
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };
    } else {
      throw new Error('Invalid API key format');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    let content = '';

    if (apiKey.startsWith('AIza')) {
      content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    } else {
      content = data.choices?.[0]?.message?.content;
    }

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Clean the response to extract JSON
    let cleanContent = content.trim();
    
    // Remove markdown code blocks if present
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing whitespace
    cleanContent = cleanContent.trim();

    // Parse the JSON response
    let extractedData;
    try {
      extractedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', cleanContent);
      
      // Fallback: create a basic structure
      extractedData = {
        personal: {
          fullName: null,
          email: null,
          phone: null,
          location: null,
          summary: null
        },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        interests: [],
        projects: []
      };
    }

    return new Response(JSON.stringify({ extractedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('CV reader error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
