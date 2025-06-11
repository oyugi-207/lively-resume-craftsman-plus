
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';

interface CVParserProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVParser: React.FC<CVParserProps> = ({ onDataExtracted, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          // For demo purposes, we'll use a simple text extraction
          // In a real implementation, you'd use a proper PDF parser
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    // For Word documents, we'll read as text for now
    // In production, you'd use a proper Word parser
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseResumeText = (text: string) => {
    try {
      // Enhanced parsing logic
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      
      // Initialize data structure
      const data = {
        personal: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: ''
        },
        experience: [] as any[],
        education: [] as any[],
        skills: [] as string[],
        projects: [] as any[],
        certifications: [] as any[],
        languages: [] as any[],
        interests: [] as string[]
      };

      // Extract email
      const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch) {
        data.personal.email = emailMatch[0];
      }

      // Extract phone
      const phoneMatch = text.match(/[\+]?[1-9]?[\-\s\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}/);
      if (phoneMatch) {
        data.personal.phone = phoneMatch[0];
      }

      // Extract name (usually first line or near email)
      const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/;
      for (const line of lines.slice(0, 5)) {
        if (namePattern.test(line) && !line.includes('@') && line.length < 50) {
          data.personal.fullName = line;
          break;
        }
      }

      // Extract location
      const locationPatterns = [
        /([A-Z][a-z]+,\s*[A-Z]{2})/,
        /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2})/,
        /([A-Z][a-z]+,\s*[A-Z][a-z]+)/
      ];
      
      for (const pattern of locationPatterns) {
        const locationMatch = text.match(pattern);
        if (locationMatch) {
          data.personal.location = locationMatch[1];
          break;
        }
      }

      // Extract skills
      const skillKeywords = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
        'HTML', 'CSS', 'TypeScript', 'PHP', 'Laravel', 'Django', 'Express',
        'MongoDB', 'MySQL', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'Azure',
        'Kubernetes', 'Linux', 'Windows', 'MacOS', 'Agile', 'Scrum',
        'Project Management', 'Leadership', 'Communication', 'Problem Solving'
      ];

      skillKeywords.forEach(skill => {
        if (text.toLowerCase().includes(skill.toLowerCase())) {
          if (!data.skills.includes(skill)) {
            data.skills.push(skill);
          }
        }
      });

      // Extract experience sections
      const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience'];
      const educationKeywords = ['education', 'academic', 'university', 'college', 'degree'];
      
      let currentSection = '';
      let experienceEntry: any = {};
      let educationEntry: any = {};
      
      lines.forEach((line, index) => {
        const lowerLine = line.toLowerCase();
        
        // Identify sections
        if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'experience';
          return;
        }
        
        if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'education';
          return;
        }

        // Parse experience entries
        if (currentSection === 'experience') {
          // Job title and company pattern
          if (line.match(/^[A-Z][a-zA-Z\s]+ at [A-Z][a-zA-Z\s&.]+/) || 
              line.match(/^[A-Z][a-zA-Z\s]+ - [A-Z][a-zA-Z\s&.]+/)) {
            
            if (experienceEntry.position) {
              data.experience.push({ ...experienceEntry, id: Date.now() + Math.random() });
            }
            
            const parts = line.split(/ at | - /);
            experienceEntry = {
              position: parts[0]?.trim() || '',
              company: parts[1]?.trim() || '',
              location: '',
              startDate: '',
              endDate: '',
              description: ''
            };
          }
          
          // Date pattern
          else if (line.match(/\d{4}\s*-\s*\d{4}/) || line.match(/\d{4}\s*-\s*present/i)) {
            const dateMatch = line.match(/(\d{4})\s*-\s*(\d{4}|present)/i);
            if (dateMatch && experienceEntry.position) {
              experienceEntry.startDate = dateMatch[1];
              experienceEntry.endDate = dateMatch[2];
            }
          }
          
          // Description (bullet points or paragraphs)
          else if (line.startsWith('•') || line.startsWith('-') || 
                   (line.length > 20 && !line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/))) {
            if (experienceEntry.position) {
              experienceEntry.description += (experienceEntry.description ? '\n' : '') + line;
            }
          }
        }

        // Parse education entries
        if (currentSection === 'education') {
          if (line.match(/Bachelor|Master|PhD|Degree|University|College/i)) {
            if (educationEntry.degree) {
              data.education.push({ ...educationEntry, id: Date.now() + Math.random() });
            }
            
            educationEntry = {
              degree: line,
              school: '',
              location: '',
              startDate: '',
              endDate: '',
              gpa: ''
            };
          }
          
          else if (line.match(/\d{4}\s*-\s*\d{4}/) && educationEntry.degree) {
            const dateMatch = line.match(/(\d{4})\s*-\s*(\d{4})/);
            if (dateMatch) {
              educationEntry.startDate = dateMatch[1];
              educationEntry.endDate = dateMatch[2];
            }
          }
        }
      });

      // Add the last entries
      if (experienceEntry.position) {
        data.experience.push({ ...experienceEntry, id: Date.now() + Math.random() });
      }
      if (educationEntry.degree) {
        data.education.push({ ...educationEntry, id: Date.now() + Math.random() });
      }

      // Extract summary/objective
      const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
      const summaryIndex = lines.findIndex(line => 
        summaryKeywords.some(keyword => line.toLowerCase().includes(keyword))
      );
      
      if (summaryIndex !== -1 && summaryIndex < lines.length - 1) {
        const summaryLines = lines.slice(summaryIndex + 1, summaryIndex + 4);
        data.personal.summary = summaryLines.join(' ').substring(0, 500);
      }

      return data;
    } catch (error) {
      console.error('Error parsing resume text:', error);
      throw new Error('Failed to parse resume content');
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(20);
      
      let text = '';
      const fileType = file.type;
      
      if (fileType === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (fileType.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        text = await extractTextFromWord(file);
      } else {
        // Try to read as plain text
        const reader = new FileReader();
        text = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      setProgress(60);

      if (!text || text.trim().length < 100) {
        throw new Error('Could not extract sufficient text from the file. Please ensure the file contains readable text content.');
      }

      const parsedData = parseResumeText(text);
      
      setProgress(90);

      // Validate extracted data
      if (!parsedData.personal.fullName && !parsedData.personal.email && 
          parsedData.experience.length === 0 && parsedData.skills.length === 0) {
        throw new Error('Could not find sufficient information in CV. Please check the file content and format.');
      }

      setProgress(100);
      setExtractedData(parsedData);
      
      toast.success('CV parsed successfully! Review the extracted data.');
      
    } catch (error: any) {
      console.error('CV parsing error:', error);
      toast.error(error.message || 'Failed to parse CV. Please try a different file or format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleUseData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Enhanced CV Parser
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!extractedData && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                ${isProcessing ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400" />
                )}
                
                <div>
                  <p className="text-lg font-medium">
                    {isProcessing ? 'Processing your CV...' : 'Upload your CV'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX, and TXT files (max 10MB)
                  </p>
                </div>
                
                {isProcessing && (
                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-center mt-1">{progress}% complete</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {extractedData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">CV parsed successfully!</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Personal Info</span>
                  </div>
                  <div className="text-sm space-y-1">
                    {extractedData.personal.fullName && (
                      <p><strong>Name:</strong> {extractedData.personal.fullName}</p>
                    )}
                    {extractedData.personal.email && (
                      <p><strong>Email:</strong> {extractedData.personal.email}</p>
                    )}
                    {extractedData.personal.phone && (
                      <p><strong>Phone:</strong> {extractedData.personal.phone}</p>
                    )}
                    {extractedData.personal.location && (
                      <p><strong>Location:</strong> {extractedData.personal.location}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">Experience</span>
                  </div>
                  <p className="text-sm">{extractedData.experience.length} positions found</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Education</span>
                  </div>
                  <p className="text-sm">{extractedData.education.length} entries found</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Skills</span>
                  </div>
                  <p className="text-sm">{extractedData.skills.length} skills identified</p>
                </div>
              </div>

              {extractedData.skills.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Detected Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.slice(0, 10).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {extractedData.skills.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{extractedData.skills.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUseData} className="flex-1">
                  Use This Data
                </Button>
                <Button variant="outline" onClick={() => setExtractedData(null)}>
                  Upload Different File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVParser;
