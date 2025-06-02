
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertTriangle, XCircle, Target, FileText, Zap } from 'lucide-react';

interface ATSOptimizerProps {
  resumeData: any;
  onOptimize: (suggestions: any) => void;
}

const ATSOptimizer: React.FC<ATSOptimizerProps> = ({ resumeData, onOptimize }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeATS = () => {
    setIsAnalyzing(true);
    
    // Simulate ATS analysis
    setTimeout(() => {
      const score = calculateATSScore();
      const newSuggestions = generateSuggestions();
      
      setAtsScore(score);
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
      
      onOptimize({ score, suggestions: newSuggestions });
    }, 2000);
  };

  const calculateATSScore = () => {
    let score = 0;
    const factors = {
      hasName: resumeData.personal?.fullName ? 20 : 0,
      hasEmail: resumeData.personal?.email ? 15 : 0,
      hasPhone: resumeData.personal?.phone ? 15 : 0,
      hasExperience: resumeData.experience?.length > 0 ? 25 : 0,
      hasEducation: resumeData.education?.length > 0 ? 15 : 0,
      hasSkills: resumeData.skills?.length > 0 ? 10 : 0
    };
    
    score = Object.values(factors).reduce((sum, val) => sum + val, 0);
    return Math.min(score, 100);
  };

  const generateSuggestions = () => {
    const suggestions = [];
    
    if (!resumeData.personal?.fullName) {
      suggestions.push({
        type: 'error',
        category: 'Contact Info',
        message: 'Add your full name',
        impact: 'High'
      });
    }
    
    if (!resumeData.personal?.email) {
      suggestions.push({
        type: 'error',
        category: 'Contact Info',
        message: 'Add your email address',
        impact: 'High'
      });
    }
    
    if (resumeData.experience?.length === 0) {
      suggestions.push({
        type: 'warning',
        category: 'Experience',
        message: 'Add work experience to improve ATS compatibility',
        impact: 'High'
      });
    }
    
    if (resumeData.skills?.length < 5) {
      suggestions.push({
        type: 'info',
        category: 'Skills',
        message: 'Add more relevant skills (aim for 5-10)',
        impact: 'Medium'
      });
    }
    
    if (jobDescription && resumeData.skills?.length > 0) {
      const jobKeywords = extractKeywords(jobDescription);
      const missingKeywords = jobKeywords.filter(keyword => 
        !resumeData.skills.some((skill: string) => 
          skill.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      if (missingKeywords.length > 0) {
        suggestions.push({
          type: 'info',
          category: 'Keywords',
          message: `Consider adding these keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
          impact: 'Medium'
        });
      }
    }
    
    return suggestions;
  };

  const extractKeywords = (text: string) => {
    const commonKeywords = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'Management', 'Leadership', 'Communication', 'Problem Solving',
      'Project Management', 'Data Analysis', 'Marketing', 'Sales'
    ];
    
    return commonKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  useEffect(() => {
    if (resumeData) {
      analyzeATS();
    }
  }, [resumeData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          ATS Optimization
        </CardTitle>
        <CardDescription>
          Improve your resume's compatibility with Applicant Tracking Systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ATS Score */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
            {atsScore}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ATS Compatibility Score - {getScoreLabel(atsScore)}
          </div>
          <Progress value={atsScore} className="w-full" />
        </div>

        {/* Job Description Input */}
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description (Optional)</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the job description here to get targeted optimization suggestions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <Button 
            onClick={analyzeATS} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze & Optimize
              </>
            )}
          </Button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Optimization Suggestions
            </h3>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {suggestion.type === 'error' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {suggestion.type === 'warning' && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  {suggestion.type === 'info' && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.category}
                    </Badge>
                    <Badge 
                      variant={suggestion.impact === 'High' ? 'destructive' : 
                              suggestion.impact === 'Medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {suggestion.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {suggestion.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ATS Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            ATS Optimization Tips
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use standard section headings (Experience, Education, Skills)</li>
            <li>• Include relevant keywords from the job description</li>
            <li>• Use simple, readable fonts</li>
            <li>• Avoid images, graphics, and complex formatting</li>
            <li>• Save as PDF to preserve formatting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ATSOptimizer;
