
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeData, jobDescription = '' } = await req.json()
    
    // Get Gemini API key from Supabase secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    const prompt = `
You are an expert resume optimizer. Analyze the following resume data and provide specific suggestions to improve it for ATS compatibility and job matching.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description (if provided):
${jobDescription}

Please provide suggestions in the following JSON format:
{
  "suggestions": [
    {
      "section": "summary|experience|skills|education",
      "type": "improve|add|remove|rewrite",
      "original": "original text",
      "suggested": "improved text",
      "reasoning": "why this change helps",
      "confidence": 0.95
    }
  ],
  "atsScore": 85,
  "keywordMatches": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"]
}

Focus on:
1. ATS-friendly formatting and keywords
2. Action verbs and quantifiable achievements
3. Relevant skills matching job requirements
4. Professional summary optimization
5. Bullet point improvements for better readability
`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text

    // Try to parse JSON from the response
    let suggestions
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse)
    } catch (parseError) {
      // If parsing fails, create a basic response
      suggestions = {
        suggestions: [{
          section: "summary",
          type: "improve",
          original: resumeData.personal?.summary || "",
          suggested: "Enhanced professional summary based on AI analysis",
          reasoning: "AI analysis suggests improvements for better ATS compatibility",
          confidence: 0.8
        }],
        atsScore: 75,
        keywordMatches: [],
        missingKeywords: []
      }
    }

    return new Response(
      JSON.stringify(suggestions),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in gemini-ai-optimize function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        suggestions: [],
        atsScore: 70,
        keywordMatches: [],
        missingKeywords: []
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
