import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Download,
  ArrowLeft,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';

interface AnalysisResult {
  atsScore: number;
  jobMatch?: number;
  issues: string[];
  suggestions: string[];
  keywordGaps: string[];
  strengths: string[];
  optimizedSections: Record<string, number>;
  optimizations?: string[];
}

const CVOptimizer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.pdf')) {
        setFile(uploadedFile);
        toast.success('CV uploaded successfully!');
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const analyzeCV = async () => {
    if (!file) {
      toast.error('Please upload a CV first');
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        atsScore: 78,
        issues: [
          'Missing contact information format optimization',
          'Skills section could be more keyword-rich',
          'Work experience lacks quantifiable achievements',
          'Education section missing relevant coursework'
        ],
        suggestions: [
          'Add more industry-specific keywords',
          'Include quantifiable metrics in achievements',
          'Optimize formatting for ATS systems',
          'Add relevant certifications section',
          'Improve action verbs in job descriptions'
        ],
        keywordGaps: [
          'Python', 'Machine Learning', 'Data Analysis', 'Project Management',
          'Agile', 'Cloud Computing', 'API Development'
        ],
        strengths: [
          'Clear work history progression',
          'Good use of action verbs',
          'Relevant education background',
          'Professional formatting'
        ],
        optimizedSections: {
          contact: 85,
          summary: 70,
          experience: 75,
          education: 80,
          skills: 65,
          format: 82
        }
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
      toast.success('CV analysis completed!');
    }, 3000);
  };

  const optimizeWithJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    setAnalyzing(true);
    
    // Simulate job-specific optimization
    setTimeout(() => {
      if (analysis) {
        const jobOptimizedAnalysis: AnalysisResult = {
          ...analysis,
          atsScore: 89,
          jobMatch: 92,
          optimizations: [
            'Tailored keywords for target role',
            'Highlighted relevant experience',
            'Adjusted skills priority',
            'Enhanced summary for role alignment'
          ]
        };
        
        setAnalysis(jobOptimizedAnalysis);
      }
      setAnalyzing(false);
      toast.success('CV optimized for target job!');
    }, 2500);
  };

  const downloadOptimizedCV = () => {
    toast.success('Optimized CV downloaded!');
    // In real implementation, this would download the optimized PDF
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-xl">
          <CardTitle className="mb-4 text-2xl">Authentication Required</CardTitle>
          <p className="text-gray-600 mb-6">Please sign in to use the CV optimizer.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-8 h-8 text-blue-600" />
                AI CV Optimizer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Upload your CV and get AI-powered optimization suggestions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload & Analysis Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your CV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="cv-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Click to upload your CV
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">
                      PDF format recommended (Max 10MB)
                    </span>
                  </Label>
                  <Input
                    id="cv-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {file && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                )}

                <Button
                  onClick={analyzeCV}
                  disabled={!file || analyzing}
                  className="w-full"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing CV...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze CV with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Job Description Input */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Job Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Paste Job Description (Optional)</Label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get tailored optimization suggestions..."
                  rows={6}
                />
                <Button
                  onClick={optimizeWithJobDescription}
                  disabled={!jobDescription.trim() || analyzing}
                  className="w-full"
                  variant="outline"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Optimize for This Job
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results Section */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* ATS Score */}
                <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      ATS Compatibility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-blue-600">{analysis.atsScore}%</div>
                      <div className="text-sm text-gray-600">ATS Compatibility</div>
                    </div>
                    <Progress value={analysis.atsScore} className="mb-4" />
                    {analysis.jobMatch && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysis.jobMatch}%</div>
                        <div className="text-sm text-gray-600">Job Match Score</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Section Scores */}
                <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Section Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(analysis.optimizedSections).map(([section, score]) => (
                      <div key={section} className="flex items-center justify-between">
                        <span className="capitalize font-medium">{section}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={score} className="w-20" />
                          <span className="text-sm font-medium w-10">{score}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Issues & Suggestions */}
                <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Improvement Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Issues Found:</h4>
                      <ul className="space-y-1">
                        {analysis.issues.map((issue, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">Suggestions:</h4>
                      <ul className="space-y-1">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Keywords Gap */}
                <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Missing Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordGaps.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-orange-600">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button 
                        onClick={downloadOptimizedCV}
                        className="w-full"
                        size="lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Optimized CV
                      </Button>
                      <Button 
                        onClick={() => navigate('/builder')}
                        variant="outline"
                        className="w-full"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Create New Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                <CardContent className="text-center py-12">
                  <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ready to Optimize Your CV?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Upload your CV to get started with AI-powered analysis and optimization suggestions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVOptimizer;
