
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, location = '', remote = false, limit = 10 } = await req.json()
    
    // Using a free job API (example with a mock structure)
    // You can replace this with actual free APIs like:
    // - Adzuna API (free tier)
    // - USAJobs API (free government jobs)
    // - Reed API (UK jobs, free tier)
    
    const mockJobs = [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        remote: true,
        salary: '$80,000 - $120,000',
        description: 'We are looking for a skilled software engineer...',
        requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        posted: '2024-01-15',
        url: 'https://example.com/job/1'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'Design Studio',
        location: 'New York, NY',
        remote: false,
        salary: '$70,000 - $95,000',
        description: 'Join our creative team as a frontend developer...',
        requirements: ['React', 'CSS', 'JavaScript', 'UI/UX'],
        posted: '2024-01-14',
        url: 'https://example.com/job/2'
      },
      {
        id: '3',
        title: 'Full Stack Developer',
        company: 'Startup Inc',
        location: 'Austin, TX',
        remote: true,
        salary: '$75,000 - $110,000',
        description: 'Looking for a full stack developer to build amazing products...',
        requirements: ['Python', 'Django', 'React', 'PostgreSQL'],
        posted: '2024-01-13',
        url: 'https://example.com/job/3'
      }
    ]

    // Filter jobs based on query parameters
    let filteredJobs = mockJobs.filter(job => {
      const matchesQuery = !query || 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(query.toLowerCase()))
      
      const matchesLocation = !location || 
        job.location.toLowerCase().includes(location.toLowerCase())
      
      const matchesRemote = !remote || job.remote

      return matchesQuery && matchesLocation && matchesRemote
    })

    // Limit results
    filteredJobs = filteredJobs.slice(0, limit)

    return new Response(
      JSON.stringify({
        jobs: filteredJobs,
        total: filteredJobs.length,
        query,
        location,
        remote
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in job-market-api function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        jobs: [],
        total: 0
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
