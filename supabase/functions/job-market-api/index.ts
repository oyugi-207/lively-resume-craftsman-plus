
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
    
    // Using multiple free job APIs as fallbacks
    let jobs = []
    
    try {
      // Try Adzuna API first (free tier available)
      const adzunaAppId = Deno.env.get('ADZUNA_APP_ID')
      const adzunaApiKey = Deno.env.get('ADZUNA_API_KEY')
      
      if (adzunaAppId && adzunaApiKey) {
        const country = 'us' // Can be made configurable
        const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${adzunaAppId}&app_key=${adzunaApiKey}&results_per_page=${limit}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`
        
        const adzunaResponse = await fetch(adzunaUrl)
        if (adzunaResponse.ok) {
          const adzunaData = await adzunaResponse.json()
          jobs = adzunaData.results?.map((job: any) => ({
            id: job.id || Math.random().toString(36).substr(2, 9),
            title: job.title || 'No title available',
            company: job.company?.display_name || 'Company not specified',
            location: job.location?.display_name || location || 'Location not specified',
            remote: job.location?.display_name?.toLowerCase().includes('remote') || false,
            salary: job.salary_min && job.salary_max 
              ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`
              : job.salary_min 
                ? `From $${Math.round(job.salary_min).toLocaleString()}`
                : 'Salary not specified',
            description: job.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'No description available',
            requirements: job.category?.tag ? [job.category.tag] : ['Not specified'],
            posted: job.created ? new Date(job.created).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            url: job.redirect_url || '#'
          })) || []
        }
      }
    } catch (error) {
      console.error('Adzuna API error:', error)
    }

    // If no jobs from Adzuna, try JSearch API (RapidAPI free tier)
    if (jobs.length === 0) {
      try {
        const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')
        
        if (rapidApiKey) {
          const jsearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + ' ' + location)}&page=1&num_pages=1&date_posted=all`
          
          const jsearchResponse = await fetch(jsearchUrl, {
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
          })
          
          if (jsearchResponse.ok) {
            const jsearchData = await jsearchResponse.json()
            jobs = jsearchData.data?.slice(0, limit).map((job: any) => ({
              id: job.job_id || Math.random().toString(36).substr(2, 9),
              title: job.job_title || 'No title available',
              company: job.employer_name || 'Company not specified',
              location: job.job_city && job.job_state 
                ? `${job.job_city}, ${job.job_state}` 
                : job.job_country || 'Location not specified',
              remote: job.job_is_remote || false,
              salary: job.job_min_salary && job.job_max_salary
                ? `$${Math.round(job.job_min_salary).toLocaleString()} - $${Math.round(job.job_max_salary).toLocaleString()}`
                : job.job_min_salary
                  ? `From $${Math.round(job.job_min_salary).toLocaleString()}`
                  : 'Salary not specified',
              description: job.job_description?.substring(0, 200) + '...' || 'No description available',
              requirements: job.job_required_skills?.slice(0, 5) || ['Not specified'],
              posted: job.job_posted_at ? new Date(job.job_posted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              url: job.job_apply_link || job.job_google_link || '#'
            })) || []
          }
        }
      } catch (error) {
        console.error('JSearch API error:', error)
      }
    }

    // If still no jobs, fall back to enhanced mock data
    if (jobs.length === 0) {
      jobs = [
        {
          id: '1',
          title: `${query || 'Software'} Engineer`,
          company: 'TechCorp Solutions',
          location: location || 'San Francisco, CA',
          remote: remote,
          salary: '$85,000 - $125,000',
          description: `We are seeking a talented ${query || 'software'} professional to join our innovative team. This role offers exciting opportunities to work with cutting-edge technologies and contribute to meaningful projects that impact millions of users.`,
          requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
          posted: '2024-01-15',
          url: 'https://example.com/job/1'
        },
        {
          id: '2',
          title: `Senior ${query || 'Frontend'} Developer`,
          company: 'Digital Innovations Inc',
          location: location || 'New York, NY',
          remote: true,
          salary: '$95,000 - $140,000',
          description: `Join our dynamic team as a senior developer and lead the development of next-generation web applications. We offer competitive compensation and excellent growth opportunities.`,
          requirements: ['React', 'Vue.js', 'CSS', 'JavaScript', 'Webpack'],
          posted: '2024-01-14',
          url: 'https://example.com/job/2'
        },
        {
          id: '3',
          title: `${query || 'Full Stack'} Developer`,
          company: 'StartupXYZ',
          location: remote ? 'Remote' : (location || 'Austin, TX'),
          remote: remote,
          salary: '$75,000 - $115,000',
          description: `Looking for a versatile developer to build amazing products from the ground up. Perfect opportunity for someone who wants to make a significant impact in a growing company.`,
          requirements: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
          posted: '2024-01-13',
          url: 'https://example.com/job/3'
        },
        {
          id: '4',
          title: `${query || 'DevOps'} Engineer`,
          company: 'CloudFirst Technologies',
          location: location || 'Seattle, WA',
          remote: true,
          salary: '$100,000 - $150,000',
          description: `We're looking for a DevOps engineer to help scale our infrastructure and improve our deployment processes. Join a team that values automation and continuous improvement.`,
          requirements: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
          posted: '2024-01-12',
          url: 'https://example.com/job/4'
        }
      ]
    }

    // Filter jobs based on query parameters
    let filteredJobs = jobs.filter(job => {
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
        remote,
        source: jobs.length > 0 ? (jobs === filteredJobs ? 'api' : 'mixed') : 'mock'
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
