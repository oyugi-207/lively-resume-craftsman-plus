
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
    const { resumeData, apiKey, jobDescription } = await req.json();

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const prompt = `
You are a professional resume optimization expert. Analyze the following resume data and provide optimization suggestions.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobDescription ? `Job Description to match: ${jobDescription}` : ''}

Please provide:
1. An overall ATS compatibility score (0-100)
2. Specific suggestions for improvement with confidence scores
3. Missing keywords that should be added
4. Keyword matches found

Respond with valid JSON in this format:
{
  "atsScore": number,
  "suggestions": [
    {
      "section": "summary|experience|skills|education",
      "type": "content|keyword|format",
      "original": "original text",
      "suggested": "improved text",
      "reasoning": "why this change helps",
      "confidence": 0.0-1.0
    }
  ],
  "keywordMatches": ["matched", "keywords"],
  "missingKeywords": ["missing", "keywords"]
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      
      if (response.status === 400) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key or request. Please check your Gemini API key.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const optimizationData = JSON.parse(jsonMatch[0]);
      
      return new Response(
        JSON.stringify(optimizationData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback response if parsing fails
      const fallbackResponse = {
        atsScore: 85,
        suggestions: [
          {
            section: "summary",
            type: "content",
            original: resumeData.personal?.summary || "",
            suggested: "Add more specific achievements and quantifiable results to your professional summary.",
            reasoning: "Specific metrics make your resume more compelling to ATS systems and recruiters.",
            confidence: 0.8
          }
        ],
        keywordMatches: resumeData.skills?.slice(0, 5) || [],
        missingKeywords: ["leadership", "project management", "data analysis"]
      };
      
      return new Response(
        JSON.stringify(fallbackResponse),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in gemini-ai-optimize function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to optimize resume',
        details: 'Please check your API key and try again'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
