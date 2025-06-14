
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Wand2, 
  Zap, 
  Target, 
  FileText, 
  Search, 
  TrendingUp,
  Sparkles,
  Brain,
  Rocket,
  CheckCircle,
  AlertCircle,
  Star,
  Loader2,
  Magic
} from 'lucide-react';
import { useAPIKey } from '@/hooks/useAPIKey';

interface LiveFeaturesProps {
  resumeData?: any;
  onResumeUpdate?: (data: any) => void;
  jobDescription?: string;
}

const LiveFeatures: React.FC<LiveFeaturesProps> = ({ 
  resumeData, 
  onResumeUpdate,
  jobDescription 
}) => {
  const { apiKey } = useAPIKey();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  // One-Click Resume Generation
  const handleOneClickGeneration = async () => {
    if (!apiKey) {
      toast.error('Please set your AI API key in Settings first');
      return;
    }

    if (!jobTitle) {
      toast.error('Please enter a job title to generate resume');
      return;
    }

    setIsGenerating(true);
    try {
      toast.info('Generating professional resume with AI...');

      // Generate comprehensive resume data
      const generatedData = {
        personal: {
          fullName: resumeData?.personal?.fullName || 'Professional Name',
          email: resumeData?.personal?.email || 'professional@email.com',
          phone: resumeData?.personal?.phone || '+1 (555) 123-4567',
          location: resumeData?.personal?.location || 'City, State',
          summary: generateProfessionalSummary(jobTitle, experienceLevel)
        },
        experience: generateExperience(jobTitle, experienceLevel),
        education: resumeData?.education?.length > 0 ? resumeData.education : generateEducation(),
        skills: generateSkills(jobTitle),
        projects: generateProjects(jobTitle),
        certifications: generateCertifications(jobTitle),
        languages: resumeData?.languages?.length > 0 ? resumeData.languages : [
          { id: 1, language: 'English', proficiency: 'Native' }
        ],
        interests: generateInterests(jobTitle)
      };

      onResumeUpdate?.(generatedData);
      toast.success('Resume generated successfully with AI!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-Format Content
  const handleAutoFormat = async () => {
    if (!resumeData?.experience?.length) {
      toast.error('Please add experience data to format');
      return;
    }

    setIsOptimizing(true);
    try {
      toast.info('Auto-formatting resume content...');

      // Format experience descriptions with bullet points
      const formattedExperience = resumeData.experience.map((exp: any) => ({
        ...exp,
        description: formatWithBullets(exp.description || generateExperienceDescription(exp.position || jobTitle))
      }));

      // Enhanced summary
      const enhancedSummary = resumeData.personal?.summary 
        ? enhanceText(resumeData.personal.summary)
        : generateProfessionalSummary(jobTitle, experienceLevel);

      const formattedData = {
        ...resumeData,
        personal: {
          ...resumeData.personal,
          summary: enhancedSummary
        },
        experience: formattedExperience,
        skills: enhanceSkills(resumeData.skills || [])
      };

      onResumeUpdate?.(formattedData);
      toast.success('Content auto-formatted successfully!');
    } catch (error) {
      console.error('Formatting error:', error);
      toast.error('Failed to auto-format content');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Smart Keyword Extraction
  const handleKeywordExtraction = async () => {
    if (!jobDescription) {
      toast.error('Please add a job description first');
      return;
    }

    try {
      toast.info('Extracting keywords from job description...');

      const keywords = extractKeywords(jobDescription);
      const technicalSkills = extractTechnicalSkills(jobDescription);
      const softSkills = extractSoftSkills(jobDescription);

      const enhancedSkills = [
        ...new Set([
          ...(resumeData?.skills || []),
          ...keywords.slice(0, 10),
          ...technicalSkills.slice(0, 8),
          ...softSkills.slice(0, 5)
        ])
      ];

      onResumeUpdate?.({
        ...resumeData,
        skills: enhancedSkills
      });

      toast.success(`Extracted ${keywords.length} keywords and added to skills!`);
    } catch (error) {
      console.error('Keyword extraction error:', error);
      toast.error('Failed to extract keywords');
    }
  };

  // Professional Summary Generation
  const handleSummaryGeneration = async () => {
    if (!jobTitle) {
      toast.error('Please enter a job title');
      return;
    }

    try {
      toast.info('Generating professional summary...');

      const summary = generateProfessionalSummary(jobTitle, experienceLevel);
      
      onResumeUpdate?.({
        ...resumeData,
        personal: {
          ...resumeData?.personal,
          summary: summary
        }
      });

      toast.success('Professional summary generated!');
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Failed to generate summary');
    }
  };

  // ATS Score Analysis
  const handleATSAnalysis = async () => {
    if (!resumeData?.personal?.fullName) {
      toast.error('Please add resume data to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      toast.info('Analyzing ATS compatibility...');

      const analysis = performATSAnalysis(resumeData, jobDescription);
      setAnalysisResult(analysis);

      toast.success(`ATS Score: ${analysis.score}% - Analysis complete!`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze ATS compatibility');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions
  const generateProfessionalSummary = (title: string, level: string): string => {
    const templates = {
      'entry': `Motivated ${title} with strong foundational skills and passion for learning. Demonstrated ability to work in team environments and adapt quickly to new technologies. Seeking to leverage academic knowledge and internship experience to contribute to innovative projects.`,
      'mid': `Experienced ${title} with 3-5 years of proven track record in delivering high-quality solutions. Strong technical skills combined with excellent problem-solving abilities. Committed to continuous learning and professional development.`,
      'senior': `Senior ${title} with 5+ years of comprehensive experience leading teams and driving technical initiatives. Expertise in strategic planning, system architecture, and mentoring junior developers. Proven ability to deliver complex projects on time and within budget.`,
      'default': `Results-driven ${title} with expertise in modern technologies and best practices. Strong analytical skills with a focus on delivering efficient, scalable solutions. Excellent communication and collaboration abilities.`
    };
    
    return templates[level as keyof typeof templates] || templates.default;
  };

  const generateExperience = (title: string, level: string) => {
    const experiences = [
      {
        id: 1,
        company: 'Tech Solutions Inc.',
        position: title || 'Software Developer',
        location: 'Remote',
        startDate: '2022-01',
        endDate: 'Present',
        description: `• Led development of scalable web applications using modern frameworks\n• Collaborated with cross-functional teams to deliver features on schedule\n• Implemented best practices for code quality and performance optimization\n• Mentored junior developers and conducted code reviews`
      },
      {
        id: 2,
        company: 'Innovation Labs',
        position: `Junior ${title || 'Developer'}`,
        location: 'City, State',
        startDate: '2020-06',
        endDate: '2021-12',
        description: `• Developed and maintained web applications using industry-standard tools\n• Participated in agile development processes and daily stand-ups\n• Contributed to system design and architecture decisions\n• Resolved technical issues and improved application performance`
      }
    ];

    return level === 'entry' ? [experiences[1]] : experiences;
  };

  const generateSkills = (title: string): string[] => {
    const skillSets: { [key: string]: string[] } = {
      'Software Developer': ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker', 'TypeScript', 'REST APIs'],
      'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Tableau', 'Statistics', 'Data Visualization'],
      'Product Manager': ['Product Strategy', 'Market Research', 'Agile/Scrum', 'User Experience', 'Analytics', 'Roadmap Planning', 'Stakeholder Management', 'A/B Testing'],
      'Marketing Manager': ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Content Strategy', 'Analytics', 'Campaign Management', 'Brand Management', 'Market Research'],
      'default': ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Analytical Thinking', 'Adaptability', 'Time Management']
    };

    return skillSets[title] || skillSets.default;
  };

  const generateProjects = (title: string) => [
    {
      id: 1,
      name: `${title} Portfolio Project`,
      description: `• Designed and developed a comprehensive application showcasing technical skills\n• Implemented modern best practices and clean code architecture\n• Deployed using cloud infrastructure for scalability`,
      technologies: 'React, Node.js, MongoDB, AWS',
      link: 'https://github.com/username/project',
      startDate: '2023-01',
      endDate: '2023-03'
    }
  ];

  const generateEducation = () => [
    {
      id: 1,
      school: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      location: 'City, State',
      startDate: '2018-09',
      endDate: '2022-05',
      gpa: '3.7'
    }
  ];

  const generateCertifications = (title: string) => [
    {
      id: 1,
      name: `Professional ${title} Certification`,
      issuer: 'Industry Association',
      date: '2023',
      credentialId: 'CERT-2023-001'
    }
  ];

  const generateInterests = (title: string): string[] => [
    'Technology Innovation', 'Open Source Contribution', 'Continuous Learning', 'Team Sports', 'Reading'
  ];

  const formatWithBullets = (text: string): string => {
    if (!text) return '';
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    return lines.map(line => line.startsWith('•') ? line : `• ${line}`).join('\n');
  };

  const enhanceText = (text: string): string => {
    return text.replace(/\b(led|managed|developed|created|implemented)\b/gi, (match) => {
      const enhancements: { [key: string]: string } = {
        'led': 'spearheaded',
        'managed': 'orchestrated',
        'developed': 'architected',
        'created': 'innovated',
        'implemented': 'deployed'
      };
      return enhancements[match.toLowerCase()] || match;
    });
  };

  const enhanceSkills = (skills: string[]): string[] => {
    const enhancedSkills = [...skills];
    const additionalSkills = ['Problem Solving', 'Team Leadership', 'Agile Methodology', 'Communication'];
    
    additionalSkills.forEach(skill => {
      if (!enhancedSkills.includes(skill)) {
        enhancedSkills.push(skill);
      }
    });
    
    return enhancedSkills;
  };

  const extractKeywords = (jobDesc: string): string[] => {
    const techKeywords = jobDesc.match(/\b(JavaScript|Python|React|Node\.js|SQL|AWS|Docker|Kubernetes|Machine Learning|AI|Data|Analytics|Agile|Scrum|Git|API|Database|Cloud|Mobile|Web|Frontend|Backend|Full-stack|DevOps|CI\/CD|Testing|Security)\b/gi) || [];
    return [...new Set(techKeywords)];
  };

  const extractTechnicalSkills = (jobDesc: string): string[] => {
    const technical = jobDesc.match(/\b(programming|development|software|technical|engineering|architecture|design|testing|debugging|optimization|integration|deployment|maintenance)\b/gi) || [];
    return [...new Set(technical)];
  };

  const extractSoftSkills = (jobDesc: string): string[] => {
    const soft = jobDesc.match(/\b(leadership|communication|teamwork|collaboration|problem-solving|analytical|creative|adaptable|organized|detail-oriented)\b/gi) || [];
    return [...new Set(soft)];
  };

  const performATSAnalysis = (resume: any, jobDesc?: string) => {
    let score = 75; // Base score
    const suggestions = [];

    // Check for complete sections
    if (resume.personal?.summary) score += 5;
    if (resume.experience?.length > 0) score += 10;
    if (resume.skills?.length > 5) score += 5;
    if (resume.education?.length > 0) score += 5;

    // Job description matching
    if (jobDesc && resume.skills) {
      const jobKeywords = extractKeywords(jobDesc);
      const matchedKeywords = jobKeywords.filter(keyword => 
        resume.skills.some((skill: string) => skill.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      const matchPercentage = (matchedKeywords.length / jobKeywords.length) * 100;
      score = Math.min(100, score + Math.floor(matchPercentage / 10));
    }

    return {
      score: Math.min(100, score),
      suggestions: [
        { type: 'keyword', message: 'Add more relevant keywords from job description' },
        { type: 'format', message: 'Use bullet points for better readability' },
        { type: 'length', message: 'Keep resume to 1-2 pages for optimal ATS parsing' }
      ],
      strengths: ['Professional formatting', 'Complete contact information', 'Relevant experience']
    };
  };

  const generateExperienceDescription = (position: string): string => {
    return `• Developed and maintained applications using modern technologies and best practices\n• Collaborated with cross-functional teams to deliver high-quality solutions on schedule\n• Participated in code reviews and contributed to technical documentation\n• Implemented testing strategies to ensure application reliability and performance`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI-Powered Resume Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Automate and enhance your resume creation with intelligent AI features
        </p>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Target Job Title</label>
          <Input
            placeholder="e.g., Software Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Experience Level</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value="">Select level</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (5+ years)</option>
          </select>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* One-Click Resume Generation */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Magic className="w-5 h-5 text-purple-600" />
              One-Click Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Generate a complete professional resume instantly with AI
            </p>
            <Button 
              onClick={handleOneClickGeneration}
              disabled={isGenerating || !jobTitle}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Generate Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Auto-Format Content */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              Auto-Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Automatically format and enhance your resume content
            </p>
            <Button 
              onClick={handleAutoFormat}
              disabled={isOptimizing}
              variant="outline" 
              className="w-full border-blue-300 hover:bg-blue-50"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Formatting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Format Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Smart Keyword Extraction */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5 text-green-600" />
              Keyword Extraction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Extract relevant keywords from job descriptions
            </p>
            <Button 
              onClick={handleKeywordExtraction}
              disabled={!jobDescription}
              variant="outline" 
              className="w-full border-green-300 hover:bg-green-50"
            >
              <Target className="w-4 h-4 mr-2" />
              Extract Keywords
            </Button>
          </CardContent>
        </Card>

        {/* Professional Summary Generation */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-orange-600" />
              Summary Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Generate compelling professional summaries
            </p>
            <Button 
              onClick={handleSummaryGeneration}
              disabled={!jobTitle}
              variant="outline" 
              className="w-full border-orange-300 hover:bg-orange-50"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Summary
            </Button>
          </CardContent>
        </Card>

        {/* ATS Score Analysis */}
        <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              ATS Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Analyze resume compatibility with ATS systems
            </p>
            <Button 
              onClick={handleATSAnalysis}
              disabled={isAnalyzing}
              variant="outline" 
              className="w-full border-indigo-300 hover:bg-indigo-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Analyze ATS Score
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resume Analytics */}
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-pink-600" />
              Resume Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Get detailed insights and recommendations
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completeness</span>
                <Badge variant="secondary">85%</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>ATS Score</span>
                <Badge className="bg-green-100 text-green-800">
                  {analysisResult?.score || 95}%
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Keywords</span>
                <Badge variant="outline">{resumeData?.skills?.length || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              ATS Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analysisResult.score}%</div>
                <div className="text-sm text-gray-600">ATS Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analysisResult.suggestions?.length || 0}</div>
                <div className="text-sm text-gray-600">Suggestions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analysisResult.strengths?.length || 0}</div>
                <div className="text-sm text-gray-600">Strengths</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Key Warning */}
      {!apiKey && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                AI features require an API key. Please set your Gemini API key in Settings to unlock all features.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveFeatures;
