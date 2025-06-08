
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import {
  Upload,
  FileText,
  Zap,
  Download,
  ArrowLeft,
  Moon,
  Sun,
  Sparkles,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

const CVOptimizer = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [optimizedText, setOptimizedText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('text')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or text file",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      // For demo purposes, we'll simulate text extraction
      // In a real implementation, you'd use a PDF parser or OCR service
      if (file.type === 'application/pdf') {
        // Simulate PDF text extraction
        setTimeout(() => {
          const mockExtractedText = `John Doe
Software Engineer

EXPERIENCE
• 3+ years of experience in web development
• Proficient in JavaScript, React, and Node.js
• Built and maintained multiple web applications
• Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2019-2023)

SKILLS
JavaScript, React, Node.js, HTML, CSS, Git, MongoDB`;
          
          setExtractedText(mockExtractedText);
          setIsProcessing(false);
          toast({
            title: "Success",
            description: "CV text extracted successfully"
          });
        }, 2000);
      } else {
        // Handle text files
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setExtractedText(text);
          setIsProcessing(false);
          toast({
            title: "Success",
            description: "CV text loaded successfully"
          });
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const optimizeCV = async () => {
    if (!extractedText) {
      toast({
        title: "No CV Content",
        description: "Please upload a CV first",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);

    try {
      // For demo purposes, we'll simulate AI optimization
      // In production, this would call your Gemini AI function
      setTimeout(() => {
        const mockOptimizedText = `John Doe
Senior Software Engineer

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 3+ years of experience developing scalable web applications. 
Expertise in modern JavaScript frameworks and full-stack development. Proven track record of 
delivering high-quality solutions in fast-paced environments.

PROFESSIONAL EXPERIENCE
Software Engineer | Tech Company | 2021-Present
• Developed and maintained 5+ responsive web applications using React and Node.js
• Improved application performance by 40% through code optimization and best practices
• Collaborated with cross-functional teams of 8+ members in Agile development environment
• Implemented automated testing strategies, reducing bugs by 60%

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2019-2023
GPA: 3.8/4.0

TECHNICAL SKILLS
Frontend: JavaScript (ES6+), React, HTML5, CSS3, TypeScript
Backend: Node.js, Express.js, RESTful APIs
Database: MongoDB, PostgreSQL
Tools: Git, Docker, Jest, Webpack`;

        const mockSuggestions = [
          {
            type: 'improvement',
            title: 'Add Quantifiable Achievements',
            description: 'Include specific numbers and metrics to demonstrate impact',
            example: 'Changed "Built applications" to "Developed 5+ responsive web applications"'
          },
          {
            type: 'keywords',
            title: 'Include Industry Keywords',
            description: 'Add relevant technical keywords to improve ATS compatibility',
            example: 'Added "TypeScript", "RESTful APIs", "Agile development"'
          },
          {
            type: 'format',
            title: 'Improve Section Headers',
            description: 'Use professional section headers for better readability',
            example: 'Changed "EXPERIENCE" to "PROFESSIONAL EXPERIENCE"'
          }
        ];

        setOptimizedText(mockOptimizedText);
        setSuggestions(mockSuggestions);
        setAtsScore(85);
        setIsOptimizing(false);
        
        toast({
          title: "CV Optimized!",
          description: "Your CV has been enhanced with AI suggestions"
        });
      }, 3000);
    } catch (error) {
      console.error('Error optimizing CV:', error);
      toast({
        title: "Error",
        description: "Failed to optimize CV",
        variant: "destructive"
      });
      setIsOptimizing(false);
    }
  };

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "No Job Description",
        description: "Please enter a job description to analyze",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate job description parsing with AI
      setTimeout(() => {
        const keyRequirements = [
          'React', 'JavaScript', 'Node.js', 'TypeScript',
          'Agile', 'RESTful APIs', 'Problem solving',
          'Team collaboration', 'Git', 'Testing'
        ];
        
        toast({
          title: "Job Description Analyzed",
          description: `Found ${keyRequirements.length} key requirements to optimize for`
        });
        
        // You could store these requirements and use them for optimization
      }, 1000);
    } catch (error) {
      console.error('Error parsing job description:', error);
      toast({
        title: "Error",
        description: "Failed to parse job description",
        variant: "destructive"
      });
    }
  };

  const downloadOptimizedCV = () => {
    if (!optimizedText) {
      toast({
        title: "No Optimized CV",
        description: "Please optimize your CV first",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([optimizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_cv.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Optimized CV downloaded successfully"
    });
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CV Optimizer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Resume Enhancement</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload and Input Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Upload Your CV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {uploadedFile ? uploadedFile.name : 'Drop your CV here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supports PDF and text files
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isProcessing && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Processing file...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Target Job Description (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to optimize your CV for specific requirements..."
                  className="min-h-[150px]"
                />
                <Button onClick={parseJobDescription} variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Job Requirements
                </Button>
              </CardContent>
            </Card>

            {/* CV Editor */}
            {extractedText && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Edit CV Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={extractedText}
                    onChange={setExtractedText}
                    placeholder="Your CV content will appear here for editing..."
                    className="min-h-[400px]"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Optimize Button */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI-Powered Optimization</h3>
                <p className="mb-4 opacity-90">
                  Enhance your CV with industry keywords, quantifiable achievements, and ATS optimization
                </p>
                <Button
                  onClick={optimizeCV}
                  disabled={!extractedText || isOptimizing}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  size="lg"
                >
                  {isOptimizing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize My CV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* ATS Score */}
            {atsScore !== null && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    ATS Compatibility Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">{atsScore}/100</span>
                    <Badge variant={atsScore >= 80 ? 'default' : atsScore >= 60 ? 'secondary' : 'destructive'}>
                      {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${atsScore}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.description}
                          </p>
                          {suggestion.example && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                              Example: {suggestion.example}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Optimized CV */}
            {optimizedText && (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Optimized CV
                    </div>
                    <Button onClick={downloadOptimizedCV} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {optimizedText}
                    </pre>
                  </div>
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
