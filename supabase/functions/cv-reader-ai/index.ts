
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
      throw new Error('Gemini API key is required');
    }

    // For PDF files, we'll extract text using a simple approach
    // In a real implementation, you might want to use a PDF parsing library
    let extractedText = '';
    
    if (fileType === 'application/pdf') {
      // For demo purposes, we'll use the Gemini vision model to read the PDF
      // In production, you'd want to use a proper PDF text extraction library
      extractedText = 'CV content from PDF file';
    } else {
      // For DOC/DOCX files, convert base64 to text (simplified)
      extractedText = atob(fileContent);
    }

    const prompt = `
    You are a CV/Resume parser. Extract structured information from this CV text and return ONLY a JSON object with the following structure:

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
          "id": "number",
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
          "id": "number",
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
          "id": "number",
          "name": "string",
          "issuer": "string",
          "date": "string",
          "credentialId": "string"
        }
      ],
      "languages": [
        {
          "id": "number", 
          "language": "string",
          "proficiency": "string"
        }
      ],
      "interests": ["interest1", "interest2"],
      "projects": [
        {
          "id": "number",
          "name": "string",
          "description": "string", 
          "technologies": "string",
          "link": "string",
          "startDate": "string",
          "endDate": "string"
        }
      ]
    }

    CV Text to parse:
    ${extractedText}

    Return ONLY the JSON object, no other text.
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process CV with AI');
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parse the JSON response
    let extractedData;
    try {
      extractedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      throw new Error('Invalid JSON response from AI');
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
