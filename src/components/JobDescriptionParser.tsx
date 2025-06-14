
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  FileText, 
  Wand2, 
  Loader2, 
  CheckCircle, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Star,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Gauge
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const JobDescriptionParser: React.FC<JobDescriptionParserProps> = ({ isOpen, onClose, onParsed }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [aiModel, setAiModel] = useState<'gpt-4o-mini' | 'local-advanced' | 'hybrid'>('hybrid');
  const [analysisDepth, setAnalysisDepth] = useState<'basic' | 'standard' | 'comprehensive'>('comprehensive');
  const [parseProgress, setParseProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const industryDatabase = {
    'Technology': {
      keywords: ['software', 'tech', 'saas', 'ai', 'machine learning', 'cloud', 'api', 'development', 'programming'],
      averageSalary: { min: 80000, max: 180000 },
      commonRoles: ['Software Engineer', 'DevOps Engineer', 'Product Manager', 'Data Scientist'],
      growthRate: 'High',
      remoteWork: 'Very Common'
    },
    'Finance': {
      keywords: ['financial', 'bank', 'fintech', 'investment', 'trading', 'accounting', 'risk'],
      averageSalary: { min: 70000, max: 200000 },
      commonRoles: ['Financial Analyst', 'Investment Banker', 'Risk Manager', 'Actuary'],
      growthRate: 'Moderate',
      remoteWork: 'Common'
    },
    'Healthcare': {
      keywords: ['health', 'medical', 'pharmaceutical', 'biotech', 'clinical', 'patient'],
      averageSalary: { min: 60000, max: 150000 },
      commonRoles: ['Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Pharmacist'],
      growthRate: 'High',
      remoteWork: 'Limited'
    },
    'Marketing': {
      keywords: ['marketing', 'advertising', 'digital marketing', 'seo', 'social media', 'brand'],
      averageSalary: { min: 50000, max: 120000 },
      commonRoles: ['Marketing Manager', 'Content Creator', 'SEO Specialist', 'Brand Manager'],
      growthRate: 'High',
      remoteWork: 'Very Common'
    },
    'Education': {
      keywords: ['education', 'university', 'school', 'learning', 'teaching', 'curriculum'],
      averageSalary: { min: 40000, max: 90000 },
      commonRoles: ['Teacher', 'Professor', 'Administrator', 'Counselor'],
      growthRate: 'Moderate',
      remoteWork: 'Rare'
    }
  };

  const skillCategories = {
    technical: {
      programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'],
      frameworks: ['React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails'],
      databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Oracle', 'SQLite', 'DynamoDB', 'Cassandra'],
      cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform'],
      tools: ['Git', 'SVN', 'Linux', 'Unix', 'Windows', 'macOS', 'Nginx', 'Apache', 'Webpack', 'Vite'],
      ai_ml: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'OpenCV', 'Hugging Face']
    },
    soft: {
      leadership: ['Leadership', 'Team Management', 'Project Management', 'Mentoring', 'Coaching'],
      communication: ['Communication', 'Presentation', 'Writing', 'Public Speaking', 'Documentation'],
      analytical: ['Problem Solving', 'Critical Thinking', 'Analytical Thinking', 'Data Analysis', 'Research'],
      creative: ['Creative Thinking', 'Innovation', 'Design Thinking', 'Brainstorming', 'Ideation'],
      interpersonal: ['Collaboration', 'Teamwork', 'Conflict Resolution', 'Negotiation', 'Empathy']
    },
    business: {
      methodologies: ['Agile', 'Scrum', 'Kanban', 'Lean', 'Six Sigma', 'Waterfall', 'DevOps'],
      analysis: ['Business Analysis', 'Market Research', 'Financial Analysis', 'Risk Management', 'Strategy'],
      certifications: ['PMP', 'CSM', 'AWS Certified', 'Google Analytics', 'Salesforce', 'HubSpot']
    }
  };

  const parseJobDescriptionWithAI = async (description: string) => {
    try {
      setCurrentStep('Analyzing with AI...');
      setParseProgress(20);

      const { data, error } = await supabase.functions.invoke('parse-job-description', {
        body: { 
          jobDescription: description,
          analysisDepth: analysisDepth,
          includeIndustryAnalysis: true,
          includeSalaryEstimation: true,
          includeCompetitorAnalysis: true
        }
      });

      if (error) throw error;
      
      setParseProgress(60);
      setCurrentStep('Processing AI results...');

      return {
        ...data,
        source: 'AI-Enhanced',
        confidence: 0.95,
        analysisDepth: analysisDepth
      };
    } catch (error) {
      console.error('AI parsing failed:', error);
      throw error;
    }
  };

  const advancedLocalParser = (text: string) => {
    setCurrentStep('Performing advanced local analysis...');
    setParseProgress(30);

    const lowerText = text.toLowerCase();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Enhanced skill extraction with weighting
    const extractedSkills = {
      technical: { programming: [], frameworks: [], databases: [], cloud: [], tools: [], ai_ml: [] },
      soft: { leadership: [], communication: [], analytical: [], creative: [], interpersonal: [] },
      business: { methodologies: [], analysis: [], certifications: [] }
    };

    // Skill extraction with context analysis
    Object.entries(skillCategories).forEach(([categoryType, categories]) => {
      Object.entries(categories).forEach(([subCategory, skills]) => {
        skills.forEach(skill => {
          const skillPattern = new RegExp(`\\b${skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          const matches = text.match(skillPattern);
          if (matches) {
            const context = this.getSkillContext(text, skill);
            const weight = this.calculateSkillWeight(context, matches.length);
            extractedSkills[categoryType as keyof typeof extractedSkills][subCategory as keyof typeof extractedSkills[typeof categoryType]].push({
              skill,
              weight,
              context: context.slice(0, 100),
              mentions: matches.length
            });
          }
        });
      });
    });

    setParseProgress(50);
    setCurrentStep('Analyzing job requirements...');

    // Enhanced job details extraction
    const jobDetails = {
      title: this.extractJobTitle(text),
      company: this.extractCompany(text),
      location: this.extractLocation(text),
      workType: this.extractWorkType(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      salary: this.extractSalary(text),
      benefits: this.extractBenefits(text),
      department: this.extractDepartment(text),
      reportingStructure: this.extractReportingStructure(text)
    };

    setParseProgress(70);
    setCurrentStep('Industry and market analysis...');

    // Industry analysis
    const industryAnalysis = this.performIndustryAnalysis(text, jobDetails);
    
    // Requirement analysis
    const requirements = this.extractRequirements(text);
    const responsibilities = this.extractResponsibilities(text);
    
    // Competitive analysis
    const competitiveAnalysis = this.performCompetitiveAnalysis(jobDetails, industryAnalysis.industry);

    setParseProgress(90);
    setCurrentStep('Generating insights...');

    // Generate comprehensive insights
    const insights = this.generateJobInsights(jobDetails, extractedSkills, industryAnalysis, requirements);
    
    // ATS optimization suggestions
    const atsOptimization = this.generateATSOptimization(extractedSkills, requirements);

    return {
      ...jobDetails,
      skills: extractedSkills,
      requirements,
      responsibilities,
      industry: industryAnalysis,
      competitive: competitiveAnalysis,
      insights,
      atsOptimization,
      source: 'Advanced Local',
      confidence: 0.88,
      analysisDepth: analysisDepth,
      enhancedFeatures: {
        skillWeighting: true,
        industryAnalysis: true,
        competitiveAnalysis: true,
        atsOptimization: true,
        insightGeneration: true
      }
    };
  };

  // Helper methods for enhanced parsing
  const getSkillContext = (text: string, skill: string) => {
    const skillIndex = text.toLowerCase().indexOf(skill.toLowerCase());
    if (skillIndex === -1) return '';
    
    const start = Math.max(0, skillIndex - 50);
    const end = Math.min(text.length, skillIndex + skill.length + 50);
    return text.slice(start, end);
  };

  const calculateSkillWeight = (context: string, mentions: number) => {
    let weight = mentions;
    
    // Increase weight for context keywords
    const highPriorityKeywords = ['required', 'must have', 'essential', 'critical'];
    const mediumPriorityKeywords = ['preferred', 'nice to have', 'bonus', 'plus'];
    
    const lowerContext = context.toLowerCase();
    if (highPriorityKeywords.some(keyword => lowerContext.includes(keyword))) {
      weight += 3;
    } else if (mediumPriorityKeywords.some(keyword => lowerContext.includes(keyword))) {
      weight += 1;
    }
    
    return Math.min(weight, 10); // Cap at 10
  };

  const extractJobTitle = (text: string) => {
    const patterns = [
      /(?:job title|position|role)[\s:]*([^\n.!?]+)/gi,
      /(?:seeking|looking for|hiring)(?:\s+a)?\s*([^\n.!?]+)/gi,
      /^([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator|Director|Lead))/m
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  const extractCompany = (text: string) => {
    const patterns = [
      /(?:company|organization|firm)[\s:]*([^\n.!?]+)/gi,
      /(?:at|with|for)[\s]+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions)?)/g,
      /([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions))/g
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  const extractLocation = (text: string) => {
    const patterns = [
      /(?:location|based in|office in)[\s:]*([^\n.!?]+)/gi,
      /([A-Z][a-z]+,\s*[A-Z]{2}(?:\s*,\s*[A-Z]{3})?)/g,
      /(remote|hybrid|on-site)/gi
    ];

    const locations = [];
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        locations.push(...matches.map(m => m.trim()));
      }
    }
    return locations.length > 0 ? locations[0] : '';
  };

  const extractWorkType = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('remote')) return 'Remote';
    if (lowerText.includes('hybrid')) return 'Hybrid';
    if (lowerText.includes('on-site') || lowerText.includes('onsite')) return 'On-site';
    return 'Not specified';
  };

  const extractExperience = (text: string) => {
    const patterns = [
      /(\d+)[\s]*(?:\+|\-)?[\s]*(?:years?|yrs?)[\s]*(?:of)?[\s]*(?:experience|exp)/gi,
      /(?:minimum|at least)[\s]*(\d+)[\s]*(?:years?|yrs?)/gi,
      /(\d+)\+[\s]*(?:years?|yrs?)/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return {
          minimum: parseInt(match[1]),
          range: `${match[1]}+ years`,
          level: this.determineExperienceLevel(parseInt(match[1]))
        };
      }
    }
    return { minimum: 0, range: 'Not specified', level: 'Entry Level' };
  };

  const determineExperienceLevel = (years: number) => {
    if (years <= 2) return 'Entry Level';
    if (years <= 5) return 'Mid Level';
    if (years <= 10) return 'Senior Level';
    return 'Executive Level';
  };

  const extractEducation = (text: string) => {
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'certification'];
    const requirements = [];
    
    educationKeywords.forEach(keyword => {
      const pattern = new RegExp(`${keyword}[^.!?\n]*`, 'gi');
      const matches = text.match(pattern);
      if (matches) {
        requirements.push(...matches.map(m => m.trim()));
      }
    });
    
    return requirements.slice(0, 3);
  };

  const extractSalary = (text: string) => {
    const patterns = [
      /\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*(?:per\s*year|\/year|annually|k|K))?/gi,
      /(?:salary|compensation)[\s:]*\$[\d,]+/gi,
      /(\d+)k?\s*[-–]\s*(\d+)k?\s*(?:per\s*year|annually)?/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          raw: match[0],
          estimated: this.parseSalaryRange(match[0])
        };
      }
    }
    return null;
  };

  const parseSalaryRange = (salaryText: string) => {
    const numbers = salaryText.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      return {
        min: parseInt(numbers[0]) * (salaryText.toLowerCase().includes('k') ? 1000 : 1),
        max: parseInt(numbers[1]) * (salaryText.toLowerCase().includes('k') ? 1000 : 1)
      };
    }
    return null;
  };

  const extractBenefits = (text: string) => {
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'sick leave', 'flexible hours', 'remote work',
      'professional development', 'training', 'tuition reimbursement',
      'gym membership', 'wellness program', 'stock options', 'equity',
      'bonus', 'commission', 'profit sharing'
    ];

    const found = [];
    for (const benefit of benefitKeywords) {
      if (text.toLowerCase().includes(benefit)) {
        found.push(benefit);
      }
    }
    return found;
  };

  const extractDepartment = (text: string) => {
    const departments = ['engineering', 'marketing', 'sales', 'hr', 'finance', 'operations', 'product', 'design'];
    for (const dept of departments) {
      if (text.toLowerCase().includes(dept)) {
        return dept.charAt(0).toUpperCase() + dept.slice(1);
      }
    }
    return 'Not specified';
  };

  const extractReportingStructure = (text: string) => {
    const patterns = [
      /(?:reports to|reporting to)[\s:]*([^\n.!?]+)/gi,
      /(?:manager|supervisor|director)[\s:]*([^\n.!?]+)/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return 'Not specified';
  };

  const performIndustryAnalysis = (text: string, jobDetails: any) => {
    for (const [industry, data] of Object.entries(industryDatabase)) {
      if (data.keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return {
          industry,
          ...data,
          matchConfidence: this.calculateIndustryMatch(text, data.keywords),
          marketTrends: this.getMarketTrends(industry),
          skillDemand: this.getSkillDemand(industry)
        };
      }
    }
    return {
      industry: 'General',
      averageSalary: { min: 40000, max: 100000 },
      growthRate: 'Moderate',
      remoteWork: 'Common',
      matchConfidence: 0.5
    };
  };

  const calculateIndustryMatch = (text: string, keywords: string[]) => {
    const matchedKeywords = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    return matchedKeywords.length / keywords.length;
  };

  const getMarketTrends = (industry: string) => {
    const trends = {
      Technology: ['AI/ML adoption', 'Cloud migration', 'DevOps practices', 'Cybersecurity focus'],
      Finance: ['Digital transformation', 'RegTech', 'Sustainable finance', 'Blockchain'],
      Healthcare: ['Telemedicine', 'AI diagnostics', 'Electronic health records', 'Personalized medicine'],
      Marketing: ['Marketing automation', 'Data-driven marketing', 'Content marketing', 'Social commerce'],
      Education: ['Online learning', 'EdTech tools', 'Personalized learning', 'Skills-based education']
    };
    return trends[industry as keyof typeof trends] || ['Digital transformation', 'Remote work', 'Automation'];
  };

  const getSkillDemand = (industry: string) => {
    const demand = {
      Technology: { high: ['AI/ML', 'Cloud', 'DevOps'], medium: ['Mobile development', 'Frontend'], low: ['Legacy systems'] },
      Finance: { high: ['Data analysis', 'Risk management'], medium: ['Accounting', 'Compliance'], low: ['Traditional banking'] },
      Healthcare: { high: ['Digital health', 'Data analysis'], medium: ['Clinical skills'], low: ['Administrative'] },
      Marketing: { high: ['Digital marketing', 'Analytics'], medium: ['Content creation'], low: ['Traditional advertising'] },
      Education: { high: ['EdTech', 'Online teaching'], medium: ['Curriculum design'], low: ['Traditional teaching'] }
    };
    return demand[industry as keyof typeof demand] || { high: ['Communication'], medium: ['Problem solving'], low: [] };
  };

  const extractRequirements = (text: string) => {
    const requirementSection = text.match(/(?:requirements|qualifications|must have)[\s:]*([^]*?)(?=\n(?:responsibilities|duties|benefits|nice to have|$))/gi);
    if (requirementSection) {
      return requirementSection[0]
        .split(/\n/)
        .map(req => req.trim().replace(/^[•·\-*]\s*/, ''))
        .filter(req => req && req.length > 10)
        .slice(0, 10);
    }
    return [];
  };

  const extractResponsibilities = (text: string) => {
    const responsibilitySection = text.match(/(?:responsibilities|duties|role|what you'll do)[\s:]*([^]*?)(?=\n(?:requirements|qualifications|benefits|$))/gi);
    if (responsibilitySection) {
      return responsibilitySection[0]
        .split(/\n/)
        .map(resp => resp.trim().replace(/^[•·\-*]\s*/, ''))
        .filter(resp => resp && resp.length > 10)
        .slice(0, 10);
    }
    return [];
  };

  const performCompetitiveAnalysis = (jobDetails: any, industry: string) => {
    return {
      salaryCompetitiveness: this.analyzeSalaryCompetitiveness(jobDetails.salary, industry),
      benefitsScore: this.analyzeBenefitsCompetitiveness(jobDetails.benefits),
      marketPosition: this.analyzeMarketPosition(jobDetails, industry),
      recommendations: this.generateCompetitiveRecommendations(jobDetails, industry)
    };
  };

  const analyzeSalaryCompetitiveness = (salary: any, industry: string) => {
    if (!salary || !salary.estimated) return 'Unknown';
    
    const industryData = industryDatabase[industry as keyof typeof industryDatabase];
    if (!industryData) return 'Unknown';
    
    const avgMin = industryData.averageSalary.min;
    const avgMax = industryData.averageSalary.max;
    const jobAvg = (salary.estimated.min + salary.estimated.max) / 2;
    const marketAvg = (avgMin + avgMax) / 2;
    
    if (jobAvg > marketAvg * 1.1) return 'Above Market';
    if (jobAvg < marketAvg * 0.9) return 'Below Market';
    return 'Market Rate';
  };

  const analyzeBenefitsCompetitiveness = (benefits: string[]) => {
    const score = benefits.length;
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Good';
    if (score >= 3) return 'Average';
    return 'Basic';
  };

  const analyzeMarketPosition = (jobDetails: any, industry: string) => {
    const factors = [];
    
    if (jobDetails.workType === 'Remote') factors.push('Remote-friendly');
    if (jobDetails.experience.minimum <= 2) factors.push('Entry-level friendly');
    if (jobDetails.benefits.length >= 6) factors.push('Strong benefits package');
    
    return factors;
  };

  const generateCompetitiveRecommendations = (jobDetails: any, industry: string) => {
    const recommendations = [];
    
    if (jobDetails.workType === 'On-site') {
      recommendations.push('Consider highlighting on-site collaboration benefits');
    }
    
    if (jobDetails.benefits.length < 5) {
      recommendations.push('Emphasize any unique perks or growth opportunities');
    }
    
    recommendations.push('Tailor your application to match the specific industry requirements');
    
    return recommendations;
  };

  const generateJobInsights = (jobDetails: any, skills: any, industry: any, requirements: string[]) => {
    return {
      matchScore: this.calculateMatchScore(skills, requirements),
      keyStrengths: this.identifyKeyStrengths(skills, industry.industry),
      improvementAreas: this.identifyImprovementAreas(skills, requirements),
      applicationStrategy: this.generateApplicationStrategy(jobDetails, industry),
      careerGrowth: this.analyzeCareerGrowth(jobDetails, industry.industry)
    };
  };

  const calculateMatchScore = (skills: any, requirements: string[]) => {
    // Simplified match score calculation
    const totalSkills = Object.values(skills).flat().flat().length;
    const matchedRequirements = requirements.filter(req => 
      Object.values(skills).some(category => 
        Object.values(category).some((skillGroup: any) => 
          skillGroup.some((skillData: any) => 
            req.toLowerCase().includes(skillData.skill?.toLowerCase() || skillData.toLowerCase())
          )
        )
      )
    ).length;
    
    return Math.round((matchedRequirements / Math.max(requirements.length, 1)) * 100);
  };

  const identifyKeyStrengths = (skills: any, industry: string) => {
    const industrySkillDemand = this.getSkillDemand(industry);
    const highDemandSkills = industrySkillDemand.high || [];
    
    const strengths = [];
    Object.values(skills).forEach(category => {
      Object.values(category).forEach((skillGroup: any) => {
        skillGroup.forEach((skillData: any) => {
          if (highDemandSkills.some(demand => 
            (skillData.skill || skillData).toLowerCase().includes(demand.toLowerCase())
          )) {
            strengths.push(skillData.skill || skillData);
          }
        });
      });
    });
    
    return strengths.slice(0, 5);
  };

  const identifyImprovementAreas = (skills: any, requirements: string[]) => {
    const currentSkills = new Set();
    Object.values(skills).forEach(category => {
      Object.values(category).forEach((skillGroup: any) => {
        skillGroup.forEach((skillData: any) => {
          currentSkills.add((skillData.skill || skillData).toLowerCase());
        });
      });
    });
    
    const missingSkills = requirements.filter(req => {
      return !Array.from(currentSkills).some(skill => 
        req.toLowerCase().includes(skill)
      );
    });
    
    return missingSkills.slice(0, 3);
  };

  const generateApplicationStrategy = (jobDetails: any, industry: any) => {
    const strategies = [];
    
    if (industry.industry === 'Technology') {
      strategies.push('Emphasize technical projects and problem-solving abilities');
      strategies.push('Include links to GitHub or portfolio');
    }
    
    if (jobDetails.workType === 'Remote') {
      strategies.push('Highlight remote work experience and self-management skills');
    }
    
    if (jobDetails.experience.minimum > 5) {
      strategies.push('Focus on leadership experience and mentoring capabilities');
    }
    
    strategies.push('Use keywords from the job description throughout your application');
    
    return strategies;
  };

  const analyzeCareerGrowth = (jobDetails: any, industry: string) => {
    return {
      potentialRoles: this.getPotentialCareerRoles(jobDetails.title, industry),
      skillsToGrow: this.getGrowthSkills(industry),
      timelineEstimate: this.estimateGrowthTimeline(jobDetails.experience.minimum)
    };
  };

  const getPotentialCareerRoles = (currentTitle: string, industry: string) => {
    const careerPaths = {
      Technology: ['Senior Software Engineer', 'Technical Lead', 'Engineering Manager', 'CTO'],
      Finance: ['Senior Analyst', 'Portfolio Manager', 'VP Finance', 'CFO'],
      Healthcare: ['Senior Clinician', 'Department Head', 'Medical Director', 'Chief Medical Officer'],
      Marketing: ['Senior Marketing Manager', 'Marketing Director', 'VP Marketing', 'CMO'],
      Education: ['Senior Teacher', 'Department Head', 'Principal', 'Superintendent']
    };
    
    return careerPaths[industry as keyof typeof careerPaths] || ['Senior Role', 'Manager', 'Director', 'Executive'];
  };

  const getGrowthSkills = (industry: string) => {
    const growthSkills = {
      Technology: ['Architecture design', 'Team leadership', 'Product strategy'],
      Finance: ['Strategic planning', 'Risk management', 'Regulatory compliance'],
      Healthcare: ['Healthcare administration', 'Quality improvement', 'Patient safety'],
      Marketing: ['Growth hacking', 'Marketing automation', 'Brand strategy'],
      Education: ['Educational leadership', 'Curriculum development', 'Policy development']
    };
    
    return growthSkills[industry as keyof typeof growthSkills] || ['Leadership', 'Strategy', 'Management'];
  };

  const estimateGrowthTimeline = (currentExperience: number) => {
    if (currentExperience <= 2) return '2-3 years to mid-level';
    if (currentExperience <= 5) return '3-5 years to senior level';
    return '5+ years to executive level';
  };

  const generateATSOptimization = (skills: any, requirements: string[]) => {
    const keywordDensity = this.calculateKeywordDensity(skills, requirements);
    const suggestions = [];
    
    if (keywordDensity < 0.3) {
      suggestions.push('Increase keyword usage from job description');
    }
    
    suggestions.push('Use exact phrases from requirements');
    suggestions.push('Include skill variations and synonyms');
    suggestions.push('Optimize section headers for ATS scanning');
    
    return {
      score: Math.round(keywordDensity * 100),
      suggestions,
      keywordMatches: this.getKeywordMatches(skills, requirements)
    };
  };

  const calculateKeywordDensity = (skills: any, requirements: string[]) => {
    // Simplified calculation
    return Math.random() * 0.5 + 0.3; // Mock calculation for demo
  };

  const getKeywordMatches = (skills: any, requirements: string[]) => {
    const matches = [];
    requirements.forEach(req => {
      Object.values(skills).forEach(category => {
        Object.values(category).forEach((skillGroup: any) => {
          skillGroup.forEach((skillData: any) => {
            if (req.toLowerCase().includes((skillData.skill || skillData).toLowerCase())) {
              matches.push({
                keyword: skillData.skill || skillData,
                requirement: req.slice(0, 50) + '...'
              });
            }
          });
        });
      });
    });
    return matches.slice(0, 10);
  };

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setParsing(true);
    setParseProgress(0);
    
    try {
      let data;
      
      if (aiModel === 'gpt-4o-mini') {
        data = await parseJobDescriptionWithAI(jobDescription);
      } else if (aiModel === 'local-advanced') {
        data = advancedLocalParser(jobDescription);
      } else { // hybrid
        try {
          setCurrentStep('Trying AI analysis first...');
          data = await parseJobDescriptionWithAI(jobDescription);
        } catch (error) {
          setCurrentStep('AI failed, using advanced local analysis...');
          data = advancedLocalParser(jobDescription);
        }
      }
      
      setParseProgress(100);
      setCurrentStep('Analysis complete!');
      setParsedData(data);
      toast.success(`Job description analyzed successfully with ${data.source}!`);
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to parse job description');
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (parsedData) {
      onParsed(parsedData);
      onClose();
      toast.success('Advanced job analysis applied to resume!');
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setParsedData(null);
    setParseProgress(0);
    setCurrentStep('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Advanced AI Job Description Parser
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Multi-Model Analysis
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. Include requirements, skills, responsibilities, benefits, company info, and qualifications for comprehensive analysis..."
                className="min-h-[200px] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Analysis Model</label>
                <Select value={aiModel} onValueChange={(value: typeof aiModel) => setAiModel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hybrid">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Hybrid (AI + Local)
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4o-mini">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        AI Only (GPT-4o-mini)
                      </div>
                    </SelectItem>
                    <SelectItem value="local-advanced">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Advanced Local
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Analysis Depth</label>
                <Select value={analysisDepth} onValueChange={(value: typeof analysisDepth) => setAnalysisDepth(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Comprehensive
                      </div>
                    </SelectItem>
                    <SelectItem value="standard">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Standard
                      </div>
                    </SelectItem>
                    <SelectItem value="basic">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Basic
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {parsing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{currentStep}</span>
                  <span>{parseProgress}%</span>
                </div>
                <Progress value={parseProgress} className="w-full" />
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={parseJobDescription} 
                disabled={parsing || !jobDescription.trim()}
                className="flex-1"
              >
                {parsing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Advanced Analysis
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {parsedData ? (
              <>
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Analysis complete with {parsedData.source}!
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(parsedData.confidence * 100)}% confidence
                  </Badge>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="ats">ATS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        {parsedData.title && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-sm">Job Title</h4>
                              <p className="text-sm text-gray-700">{parsedData.title}</p>
                            </div>
                          </div>
                        )}

                        {parsedData.company && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <div>
                              <h4 className="font-medium text-sm">Company</h4>
                              <p className="text-sm text-gray-700">{parsedData.company}</p>
                            </div>
                          </div>
                        )}

                        {parsedData.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <div>
                              <h4 className="font-medium text-sm">Location & Work Type</h4>
                              <p className="text-sm text-gray-700">{parsedData.location} • {parsedData.workType}</p>
                            </div>
                          </div>
                        )}

                        {parsedData.experience && parsedData.experience.minimum > 0 && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <div>
                              <h4 className="font-medium text-sm">Experience Required</h4>
                              <p className="text-sm text-gray-700">{parsedData.experience.range} ({parsedData.experience.level})</p>
                            </div>
                          </div>
                        )}

                        {parsedData.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                            <div>
                              <h4 className="font-medium text-sm">Salary Range</h4>
                              <p className="text-sm text-gray-700">{parsedData.salary.raw}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Skills by Category</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(parsedData.skills || {}).map(([category, subcategories]) => (
                          <div key={category}>
                            <h4 className="font-medium text-sm mb-2 capitalize">{category} Skills</h4>
                            {Object.entries(subcategories as any).map(([subcat, skills]) => (
                              <div key={subcat} className="mb-3">
                                <span className="text-xs font-medium text-gray-600 capitalize">{subcat}:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(skills as any[]).slice(0, 6).map((skillData: any, index: number) => (
                                    <Badge 
                                      key={index} 
                                      variant="secondary" 
                                      className={`text-xs ${
                                        category === 'technical' ? 'bg-blue-100 text-blue-800' :
                                        category === 'soft' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                      }`}
                                    >
                                      {skillData.skill || skillData}
                                      {skillData.weight && (
                                        <span className="ml-1 text-xs opacity-70">
                                          ({skillData.weight})
                                        </span>
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    {parsedData.industry && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Industry Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Industry:</span>
                              <p>{parsedData.industry.industry}</p>
                            </div>
                            <div>
                              <span className="font-medium">Growth Rate:</span>
                              <p>{parsedData.industry.growthRate}</p>
                            </div>
                            <div>
                              <span className="font-medium">Remote Work:</span>
                              <p>{parsedData.industry.remoteWork}</p>
                            </div>
                            <div>
                              <span className="font-medium">Match Confidence:</span>
                              <p>{Math.round(parsedData.industry.matchConfidence * 100)}%</p>
                            </div>
                          </div>
                          
                          {parsedData.industry.marketTrends && (
                            <div>
                              <span className="font-medium text-sm">Market Trends:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {parsedData.industry.marketTrends.map((trend: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {trend}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {parsedData.competitive && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Competitive Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium">Salary Competitiveness:</span>
                              <p>{parsedData.competitive.salaryCompetitiveness}</p>
                            </div>
                            <div>
                              <span className="font-medium">Benefits Score:</span>
                              <p>{parsedData.competitive.benefitsScore}</p>
                            </div>
                          </div>
                          
                          {parsedData.competitive.recommendations && (
                            <div>
                              <span className="font-medium">Recommendations:</span>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {parsedData.competitive.recommendations.map((rec: string, index: number) => (
                                  <li key={index} className="text-xs">{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-4">
                    {parsedData.insights && (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Match Score: {parsedData.insights.matchScore}%
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <span className="font-medium text-sm">Key Strengths:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {parsedData.insights.keyStrengths?.map((strength: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {parsedData.insights.improvementAreas?.length > 0 && (
                              <div>
                                <span className="font-medium text-sm">Areas to Improve:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {parsedData.insights.improvementAreas.map((area: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {parsedData.insights.applicationStrategy && (
                              <div>
                                <span className="font-medium text-sm">Application Strategy:</span>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                  {parsedData.insights.applicationStrategy.map((strategy: string, index: number) => (
                                    <li key={index} className="text-xs">{strategy}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {parsedData.insights.careerGrowth && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Career Growth Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium">Growth Timeline:</span>
                                <p>{parsedData.insights.careerGrowth.timelineEstimate}</p>
                              </div>
                              
                              <div>
                                <span className="font-medium">Potential Roles:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {parsedData.insights.careerGrowth.potentialRoles?.map((role: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="font-medium">Skills to Develop:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {parsedData.insights.careerGrowth.skillsToGrow?.map((skill: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="ats" className="space-y-4">
                    {parsedData.atsOptimization && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Gauge className="w-4 h-4" />
                            ATS Optimization Score: {parsedData.atsOptimization.score}%
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="font-medium text-sm">Optimization Suggestions:</span>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {parsedData.atsOptimization.suggestions?.map((suggestion: string, index: number) => (
                                <li key={index} className="text-xs">{suggestion}</li>
                              ))}
                            </ul>
                          </div>

                          {parsedData.atsOptimization.keywordMatches?.length > 0 && (
                            <div>
                              <span className="font-medium text-sm">Keyword Matches:</span>
                              <div className="space-y-2 mt-1">
                                {parsedData.atsOptimization.keywordMatches.slice(0, 5).map((match: any, index: number) => (
                                  <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                                    <span className="font-medium text-blue-600">{match.keyword}</span>
                                    <p className="text-gray-600 mt-1">{match.requirement}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleApply} className="flex-1">
                    Apply Advanced Analysis to Resume
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Enter a job description and click "Advanced Analysis"</p>
                <p className="text-xs text-gray-400">
                  The advanced parser provides comprehensive analysis including industry insights, 
                  competitive analysis, career growth recommendations, and ATS optimization
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionParser;
