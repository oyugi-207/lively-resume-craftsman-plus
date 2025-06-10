import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileText, X, CheckCircle, AlertCircle, User, Briefcase, GraduationCap } from 'lucide-react';

interface CVParserProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVParser: React.FC<CVParserProps> = ({ onDataExtracted, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          let text = '';
          
          if (file.type === 'text/plain') {
            text = e.target?.result as string;
          } else if (file.type === 'application/pdf') {
            // For PDF files, read as text and clean up
            const content = e.target?.result as string;
            // Extract readable text patterns and remove binary data
            text = content
              .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, ' ') // Remove control characters
              .replace(/[^\x20-\x7E\s]/g, ' ') // Keep only printable ASCII
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
          } else {
            // For DOC/DOCX files, try to extract readable content
            const content = e.target?.result as string;
            text = content
              .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, ' ')
              .replace(/[^\x20-\x7E\s]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          }
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // Read file as text to avoid binary issues
      reader.readAsText(file, 'UTF-8');
    });
  };

  const parseResumeData = (text: string) => {
    console.log('Parsing text:', text.substring(0, 500)); // Debug log
    
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

    // Clean the text first - FIXED REGEX
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.,\-()]/g, ' ') // Fixed: moved dash to end to avoid range issues
      .trim();

    const lines = cleanText.split(/[.\n]/).map(line => line.trim()).filter(line => line.length > 3);

    // Extract email with improved regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatch = cleanText.match(emailRegex);
    if (emailMatch) data.personal.email = emailMatch[0];

    // Extract phone with improved regex
    const phoneRegex = /(\+?\d{1,3}[\-.\s]?)?\(?\d{3}\)?[\-.\s]?\d{3}[\-.\s]?\d{4}/g;
    const phoneMatch = cleanText.match(phoneRegex);
    if (phoneMatch) data.personal.phone = phoneMatch[0];

    // Extract name from first meaningful line
    const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/;
    for (const line of lines.slice(0, 5)) {
      if (namePattern.test(line) && !line.includes('@') && line.length < 50) {
        data.personal.fullName = line;
        break;
      }
    }

    // Extract location
    const locationRegex = /([A-Z][a-z]+(,\s*[A-Z]{2})?)|([A-Z][a-z]+\s+[A-Z][a-z]+,?\s*[A-Z]{2,})/g;
    const locationMatch = cleanText.match(locationRegex);
    if (locationMatch) {
      data.personal.location = locationMatch.find(loc => loc.length > 5 && loc.length < 50) || locationMatch[0];
    }

    // Extract skills - look for technical skills and common job skills
    const skillKeywords = [
      'javascript', 'python', 'java', 'react', 'nodejs', 'html', 'css', 'sql', 'aws', 'docker',
      'management', 'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
      'project management', 'agile', 'scrum', 'git', 'mongodb', 'postgresql', 'kubernetes'
    ];

    const textLower = cleanText.toLowerCase();
    skillKeywords.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        const properCase = skill.charAt(0).toUpperCase() + skill.slice(1);
        if (!data.skills.includes(properCase)) {
          data.skills.push(properCase);
        }
      }
    });

    // Extract experience entries
    const expKeywords = ['experience', 'work', 'employment', 'career'];
    const eduKeywords = ['education', 'academic', 'university', 'college', 'degree'];
    
    let currentSection = '';
    let tempExperience: any = null;
    let tempEducation: any = null;

    lines.forEach((line, index) => {
      const lineLower = line.toLowerCase();
      
      // Detect sections
      if (expKeywords.some(keyword => lineLower.includes(keyword))) {
        currentSection = 'experience';
      } else if (eduKeywords.some(keyword => lineLower.includes(keyword))) {
        currentSection = 'education';
      }

      // Extract dates
      const datePattern = /(20\d{2}|19\d{2})/g;
      const dates = line.match(datePattern);

      if (currentSection === 'experience' && line.length > 10) {
        if (dates || line.includes('Manager') || line.includes('Developer') || line.includes('Engineer')) {
          if (tempExperience) {
            data.experience.push(tempExperience);
          }
          
          tempExperience = {
            id: Date.now() + Math.random(),
            position: line.split(/[,-]/)[0].trim(),
            company: line.split(/[,-]/)[1]?.trim() || 'Company',
            location: '',
            startDate: dates?.[0] || '',
            endDate: dates?.[1] || dates?.[0] || '',
            description: ''
          };
        } else if (tempExperience && line.length > 20) {
          tempExperience.description += (tempExperience.description ? '\n' : '') + `• ${line}`;
        }
      }

      if (currentSection === 'education' && line.length > 10) {
        if (line.includes('University') || line.includes('College') || line.includes('Bachelor') || line.includes('Master')) {
          if (tempEducation) {
            data.education.push(tempEducation);
          }
          
          tempEducation = {
            id: Date.now() + Math.random(),
            degree: line.includes('Bachelor') || line.includes('Master') ? line : 'Degree',
            school: line.includes('University') || line.includes('College') ? line : 'Institution',
            location: '',
            startDate: dates?.[0] || '',
            endDate: dates?.[1] || dates?.[0] || '',
            gpa: ''
          };
        }
      }
    });

    // Add remaining items
    if (tempExperience) data.experience.push(tempExperience);
    if (tempEducation) data.education.push(tempEducation);

    // Generate a basic summary if none found
    if (!data.personal.summary && data.experience.length > 0) {
      const topSkills = data.skills.slice(0, 3).join(', ');
      const years = data.experience.length > 1 ? `${data.experience.length}+ years` : 'Experienced';
      data.personal.summary = `${years} professional with expertise in ${topSkills}. Proven track record in delivering high-quality results and contributing to team success.`;
    }

    // Add some common projects if experience exists
    if (data.experience.length > 0 && data.projects.length === 0) {
      data.projects.push({
        id: Date.now(),
        name: 'Professional Project',
        description: 'Contributed to key business initiatives and process improvements.',
        technologies: data.skills.slice(0, 3).join(', '),
        link: '',
        startDate: '',
        endDate: ''
      });
    }

    return data;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(25);
      toast.info('Reading CV file...');
      
      const text = await extractTextFromFile(file);
      setProgress(50);
      
      if (!text || text.length < 50) {
        throw new Error('Could not extract readable text from file');
      }
      
      toast.info('Analyzing CV content...');
      const parsedData = parseResumeData(text);
      setProgress(75);
      
      // Validate extracted data
      if (!parsedData.personal.fullName && !parsedData.personal.email) {
        throw new Error('Could not find key information in CV');
      }
      
      setExtractedData(parsedData);
      setProgress(100);
      
      toast.success('CV parsed successfully!');
      
    } catch (error) {
      console.error('Error processing CV:', error);
      toast.error('Failed to parse CV. Please ensure the file contains readable text.');
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
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleApplyData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
      toast.success('CV data applied successfully!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Enhanced CV Parser
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!extractedData && (
            <>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      {isDragActive ? 'Drop your CV here' : 'Upload your CV for intelligent parsing'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Supports TXT, PDF, DOC, and DOCX files
                    </p>
                    <Button variant="outline">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing your CV...</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">
                    Extracting and analyzing your professional information
                  </p>
                </div>
              )}
            </>
          )}

          {extractedData && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">CV parsed successfully!</span>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">Personal Info</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-medium">Name:</span> {extractedData.personal.fullName || 'Not found'}</p>
                    <p><span className="font-medium">Email:</span> {extractedData.personal.email || 'Not found'}</p>
                    <p><span className="font-medium">Phone:</span> {extractedData.personal.phone || 'Not found'}</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm">Experience</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p>{extractedData.experience.length} job entries</p>
                    <p>{extractedData.skills.length} skills found</p>
                    <p>{extractedData.projects.length} projects</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-sm">Education</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p>{extractedData.education.length} education entries</p>
                    <p>{extractedData.certifications.length} certifications</p>
                    <p>{extractedData.languages.length} languages</p>
                  </div>
                </Card>
              </div>

              {/* Skills Preview */}
              {extractedData.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Skills Found</h4>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.slice(0, 15).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {extractedData.skills.length > 15 && (
                      <Badge variant="outline" className="text-xs">
                        +{extractedData.skills.length - 15} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Summary Preview */}
              {extractedData.personal.summary && (
                <div>
                  <h4 className="font-medium mb-2">Generated Summary</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {extractedData.personal.summary}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Please review and edit the extracted information as needed.</span>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleApplyData} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Apply to Resume Builder
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
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
