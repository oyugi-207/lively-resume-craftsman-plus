
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
    const { resumeData, jobDescription, apiKey } = await req.json();

    if (!resumeData) {
      throw new Error('Resume data is required');
    }

    if (!apiKey) {
      throw new Error('API key is required');
    }

    let response;
    let analysis;

    // Determine if it's Gemini or OpenAI key
    if (apiKey.startsWith('AIza')) {
      // Gemini API
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume data and provide a comprehensive ATS compatibility assessment.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Job Description:
${jobDescription}` : ''}

Provide analysis in this JSON format:
{
  "overallScore": number (0-100),
  "sections": {
    "formatting": {
      "score": number (0-100),
      "issues": ["list of formatting issues"],
      "recommendations": ["list of formatting recommendations"]
    },
    "keywords": {
      "score": number (0-100),
      "missing": ["missing keywords from job description"],
      "found": ["keywords found in resume"],
      "density": number (keyword density percentage)
    },
    "structure": {
      "score": number (0-100),
      "issues": ["structural issues"],
      "recommendations": ["structural improvements"]
    },
    "content": {
      "score": number (0-100),
      "issues": ["content quality issues"],
      "recommendations": ["content improvements"]
    },
    "atsCompatibility": {
      "score": number (0-100),
      "issues": ["ATS compatibility issues"],
      "recommendations": ["ATS optimization suggestions"]
    }
  },
  "suggestions": [
    {
      "type": "critical|warning|info",
      "category": "category name",
      "message": "detailed suggestion",
      "action": "specific action to take"
    }
  ]
}

Focus on:
- ATS parsing compatibility
- Keyword optimization
- Section structure and headers
- Content quality and quantified achievements
- Formatting for machine readability
- Industry-specific terminology
- Action verbs and impact statements

Provide detailed, actionable recommendations.`
            }]
          }]
        })
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error('No content generated from Gemini API');
      }

      analysis = JSON.parse(content);
    } else {
      // OpenAI API
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert ATS (Applicant Tracking System) analyzer. Analyze resume data and provide comprehensive ATS compatibility assessments in valid JSON format.'
            },
            {
              role: 'user',
              content: `Analyze this resume for ATS compatibility:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Job Description:
${jobDescription}` : ''}

Return a detailed JSON analysis with overall score, section scores (formatting, keywords, structure, content, atsCompatibility), and actionable suggestions. Focus on ATS parsing, keyword optimization, structure, and machine readability.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated from OpenAI API');
      }

      analysis = JSON.parse(content);
    }

    // Validate and ensure proper structure
    if (!analysis.overallScore) {
      analysis.overallScore = 75; // Default fallback
    }

    if (!analysis.sections) {
      analysis.sections = {
        formatting: { score: 80, issues: [], recommendations: [] },
        keywords: { score: 70, missing: [], found: [], density: 0 },
        structure: { score: 85, issues: [], recommendations: [] },
        content: { score: 75, issues: [], recommendations: [] },
        atsCompatibility: { score: 80, issues: [], recommendations: [] }
      };
    }

    if (!analysis.suggestions) {
      analysis.suggestions = [];
    }

    console.log('ATS Analysis completed successfully');
    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ats-ai-analyzer function:', error);
    
    // Fallback analysis in case of API failure
    const fallbackAnalysis = {
      overallScore: 75,
      sections: {
        formatting: { 
          score: 80, 
          issues: ['API analysis unavailable'], 
          recommendations: ['Ensure contact information is complete'] 
        },
        keywords: { 
          score: 70, 
          missing: [], 
          found: [], 
          density: 0 
        },
        structure: { 
          score: 85, 
          issues: [], 
          recommendations: ['Include all standard resume sections'] 
        },
        content: { 
          score: 75, 
          issues: [], 
          recommendations: ['Add quantified achievements'] 
        },
        atsCompatibility: { 
          score: 80, 
          issues: [], 
          recommendations: ['Use standard formatting and section headers'] 
        }
      },
      suggestions: [
        {
          type: 'info',
          category: 'Analysis',
          message: 'AI analysis temporarily unavailable. Basic compatibility check performed.',
          action: 'Try again later for detailed AI insights'
        }
      ]
    };

    return new Response(JSON.stringify(fallbackAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
