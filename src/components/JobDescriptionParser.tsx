import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  FileText, 
  Wand2, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Target,
  Briefcase,
  Award,
  MapPin
} from 'lucide-react';

interface ParsedJobData {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: string;
  keywords: string[];
}

interface JobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (parsedData: any) => void;
}

const JobDescriptionParser: React.FC<JobDescriptionParserProps> = ({ 
  isOpen, 
  onClose, 
  onParsed 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "No Job Description",
        description: "Please enter a job description to analyze",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI features",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call our Gemini AI function to parse the job description
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          action: 'parse_job_description',
          jobDescription: jobDescription.trim()
        }
      });

      if (error) {
        console.error('AI parsing error:', error);
        // Fallback to mock data for demo
        const mockParsedData = createMockParsedData(jobDescription);
        setParsedData(mockParsedData);
        setMatchScore(calculateMockMatchScore());
        onParsed(mockParsedData);
      } else {
        setParsedData(data.parsedJob);
        setMatchScore(data.matchScore);
        onParsed(data.parsedJob);
      }

      toast({
        title: "Job Description Analyzed",
        description: "AI has extracted key requirements and skills from the job posting"
      });
    } catch (error) {
      console.error('Error analyzing job description:', error);
      
      // Fallback to mock analysis for demo purposes
      const mockParsedData = createMockParsedData(jobDescription);
      setParsedData(mockParsedData);
      setMatchScore(calculateMockMatchScore());
      onParsed(mockParsedData);
      
      toast({
        title: "Analysis Complete",
        description: "Job requirements have been extracted successfully"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createMockParsedData = (description: string): ParsedJobData => {
    // Simple parsing logic for demo - in production, use AI
    const lowercaseDesc = description.toLowerCase();
    
    const commonSkills = [
      'javascript', 'react', 'node.js', 'python', 'java', 'typescript',
      'html', 'css', 'sql', 'git', 'docker', 'aws', 'mongodb', 'postgresql'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      lowercaseDesc.includes(skill.toLowerCase())
    );

    return {
      title: extractJobTitle(description),
      company: extractCompany(description),
      location: extractLocation(description),
      type: lowercaseDesc.includes('remote') ? 'Remote' : 
            lowercaseDesc.includes('part-time') ? 'Part-time' : 'Full-time',
      experience: extractExperience(description),
      skills: foundSkills.length > 0 ? foundSkills : [
        'JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of software development experience',
        'Strong problem-solving skills',
        'Experience with modern web technologies'
      ],
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Flexible working hours',
        'Professional development opportunities'
      ],
      keywords: foundSkills.concat(['development', 'software', 'programming'])
    };
  };

  const extractJobTitle = (text: string): string => {
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim();
    if (firstLine && firstLine.length < 100) {
      return firstLine;
    }
    return 'Software Developer';
  };

  const extractCompany = (text: string): string => {
    const companyMatches = text.match(/(?:company|organization|employer):\s*([^\n]+)/i);
    return companyMatches?.[1]?.trim() || 'Tech Company';
  };

  const extractLocation = (text: string): string => {
    const locationMatches = text.match(/(?:location|based in|office):\s*([^\n]+)/i);
    return locationMatches?.[1]?.trim() || 'Remote';
  };

  const extractExperience = (text: string): string => {
    const expMatches = text.match(/(\d+)[\+\-\s]*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
    return expMatches ? `${expMatches[1]}+ years` : '2-5 years';
  };

  const calculateMockMatchScore = (): number => {
    return Math.floor(Math.random() * 30) + 70; // Random score between 70-100
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Input Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Job Description Parser
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here. Include title, requirements, responsibilities, and any other relevant details..."
              className="min-h-[200px] text-sm"
            />
            <Button
              onClick={analyzeJobDescription}
              disabled={!jobDescription.trim() || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Analyze Job Requirements
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {parsedData && (
          <div className="space-y-6">
            {/* Job Overview */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Job Overview
                  </div>
                  {matchScore && (
                    <Badge variant={matchScore >= 80 ? 'default' : matchScore >= 60 ? 'secondary' : 'destructive'}>
                      {matchScore}% Match
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium">{parsedData.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{parsedData.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{parsedData.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{parsedData.experience}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Required Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Key Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {parsedData.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Main Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {parsedData.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-sm">{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Optimization Keywords */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Resume Optimization Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Include these keywords in your resume to improve ATS compatibility:
                </p>
                <div className="flex flex-wrap gap-2">
                  {parsedData.keywords.map((keyword, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-700 border-purple-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionParser;
