import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  Brain, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Clock, 
  TrendingUp, 
  Sparkles,
  Loader2
} from 'lucide-react';

interface JobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

interface ParsedJobData {
  company: string;
  position: string;
  experienceLevel: string;
  employmentType: string;
  matchScore: number;
  requiredSkills: string[];
  responsibilities: string[];
  suggestions: string[];
}

const JobDescriptionParser = ({ isOpen, onClose, onParsed }: JobDescriptionParserProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setError(null);
    setParsing(true);

    try {
      // Simulate AI parsing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock parsed data
      const mockParsedData: ParsedJobData = {
        company: 'Tech Innovations Inc.',
        position: 'Senior Software Engineer',
        experienceLevel: 'Mid-Senior Level',
        employmentType: 'Full-time',
        matchScore: 88,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'AWS', 'SQL'],
        responsibilities: [
          'Develop scalable web applications',
          'Collaborate with cross-functional teams',
          'Write clean, maintainable code',
          'Participate in code reviews'
        ],
        suggestions: [
          'Highlight your experience with React',
          'Emphasize your AWS certifications',
          'Quantify your achievements with metrics'
        ]
      };

      setParsedData(mockParsedData);
      setParsing(false);
    } catch (error: any) {
      console.error('Error parsing job description:', error);
      setError(error.message || 'Failed to parse job description');
      setParsing(false);
    }
  };

  const applyToResume = () => {
    if (parsedData) {
      onParsed({
        skills: parsedData.requiredSkills,
        experience: {
          company: parsedData.company,
          position: parsedData.position,
          description: parsedData.responsibilities.join('\n')
        },
        summary: parsedData.suggestions.join('\n')
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Job Description Parser
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!jobDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={parseJobDescription}
                  disabled={!jobDescription.trim() || parsing}
                  className="mt-4 w-full"
                >
                  {parsing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  {parsing ? 'Analyzing...' : 'Analyze Job Description'}
                </Button>
              </CardContent>
            </Card>
          )}

          {parsedData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">Job description analyzed successfully!</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Position Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium text-sm">Company:</span>
                      <p className="text-sm text-gray-600">{parsedData.company}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Role:</span>
                      <p className="text-sm text-gray-600">{parsedData.position}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Experience:</span>
                      <p className="text-sm text-gray-600">{parsedData.experienceLevel}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      Employment Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-blue-100 text-blue-800">
                      {parsedData.employmentType}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      Match Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {parsedData.matchScore}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Key Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {parsedData.responsibilities.map((resp, index) => (
                      <li key={index} className="text-sm">{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {parsedData.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm">{suggestion}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  onClick={applyToResume}
                  className="flex-1"
                >
                  Apply to Resume
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setJobDescription('');
                    setParsedData(null);
                  }}
                >
                  Parse Another
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionParser;
