
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface CVParserProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

interface ExtractedData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: string[];
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
}

const CVParser: React.FC<CVParserProps> = ({ onDataExtracted, onClose }) => {
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string>('');

  const parseResumeText = (text: string): ExtractedData => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const data: ExtractedData = {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: []
    };

    let currentSection = '';
    let currentExperience: any = null;
    let currentEducation: any = null;
    let currentProject: any = null;

    // Extract contact information
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      
      // Extract email
      const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch && !data.personal.email) {
        data.personal.email = emailMatch[0];
      }

      // Extract phone
      const phoneMatch = line.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
      if (phoneMatch && !data.personal.phone) {
        data.personal.phone = phoneMatch[0].trim();
      }

      // Extract name (usually first few lines, alphabetic characters only)
      if (index < 5 && !data.personal.fullName && /^[a-zA-Z\s]{3,}$/.test(line) && line.length > 3) {
        data.personal.fullName = line;
      }

      // Extract location (look for city, state patterns)
      if (!data.personal.location && (line.includes(',') || /\b(NY|CA|TX|FL|IL|PA|OH|GA|NC|MI)\b/.test(line))) {
        data.personal.location = line;
      }
    });

    // Parse sections
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      
      // Detect sections
      if (lowerLine.includes('experience') || lowerLine.includes('work history') || lowerLine.includes('employment')) {
        currentSection = 'experience';
        return;
      } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
        currentSection = 'education';
        return;
      } else if (lowerLine.includes('skills') || lowerLine.includes('competencies') || lowerLine.includes('technologies')) {
        currentSection = 'skills';
        return;
      } else if (lowerLine.includes('summary') || lowerLine.includes('objective') || lowerLine.includes('profile')) {
        currentSection = 'summary';
        return;
      } else if (lowerLine.includes('projects') || lowerLine.includes('portfolio')) {
        currentSection = 'projects';
        return;
      }

      // Parse content based on section
      switch (currentSection) {
        case 'summary':
          if (!data.personal.summary && line.length > 20) {
            data.personal.summary = line;
          }
          break;

        case 'skills':
          if (line.length > 2) {
            const skills = line.split(/[,|•·‣▪▫\-\n]/)
              .map(s => s.trim())
              .filter(s => s && s.length > 1 && s.length < 30);
            data.skills.push(...skills);
          }
          break;

        case 'experience':
          // Look for job title patterns
          if (line.includes('|') || line.includes('-') || /\d{4}/.test(line) || 
              (index < lines.length - 1 && lines[index + 1].includes('•'))) {
            if (currentExperience) {
              data.experience.push(currentExperience);
            }
            
            const parts = line.split(/[|\-–]/);
            currentExperience = {
              id: Date.now() + Math.random(),
              position: parts[0]?.trim() || '',
              company: parts[1]?.trim() || '',
              location: parts[2]?.trim() || '',
              startDate: '',
              endDate: '',
              description: ''
            };

            // Extract dates
            const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
            if (dateMatch) {
              currentExperience.startDate = dateMatch[1];
              currentExperience.endDate = dateMatch[2];
            }
          } else if (currentExperience && (line.startsWith('•') || line.startsWith('-') || line.length > 20)) {
            currentExperience.description += (currentExperience.description ? '\n' : '') + line;
          }
          break;

        case 'education':
          if (line.includes('University') || line.includes('College') || line.includes('Institute') || 
              line.includes('Bachelor') || line.includes('Master') || line.includes('PhD')) {
            if (currentEducation) {
              data.education.push(currentEducation);
            }
            
            currentEducation = {
              id: Date.now() + Math.random(),
              school: '',
              degree: '',
              location: '',
              startDate: '',
              endDate: '',
              gpa: ''
            };

            if (line.includes('Bachelor') || line.includes('Master') || line.includes('PhD')) {
              currentEducation.degree = line;
            } else {
              currentEducation.school = line;
            }

            // Extract dates
            const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4})/);
            if (dateMatch) {
              currentEducation.startDate = dateMatch[1];
              currentEducation.endDate = dateMatch[2];
            }
          }
          break;

        case 'projects':
          if (line.length > 10 && !line.startsWith('•')) {
            if (currentProject) {
              data.projects.push(currentProject);
            }
            
            currentProject = {
              id: Date.now() + Math.random(),
              name: line,
              description: '',
              technologies: '',
              link: '',
              startDate: '',
              endDate: ''
            };
          } else if (currentProject && line.startsWith('•')) {
            currentProject.description += (currentProject.description ? '\n' : '') + line;
          }
          break;
      }
    });

    // Add any remaining items
    if (currentExperience) data.experience.push(currentExperience);
    if (currentEducation) data.education.push(currentEducation);
    if (currentProject) data.projects.push(currentProject);

    // Remove duplicates from skills
    data.skills = [...new Set(data.skills)];

    return data;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setParsing(true);
    setProgress(0);
    setError('');

    try {
      setProgress(20);
      toast.info('Reading CV file...');

      let text = '';
      
      if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        // For PDF and DOC files, read as text (basic extraction)
        const reader = new FileReader();
        text = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      setProgress(50);
      toast.info('Extracting information...');

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const extracted = parseResumeText(text);
      setProgress(80);

      setProgress(100);
      setExtractedData(extracted);
      toast.success('CV parsed successfully!');

    } catch (error) {
      console.error('CV parsing error:', error);
      setError('Failed to parse CV. Please try a different file format.');
      toast.error('Failed to parse CV');
    } finally {
      setParsing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const handleApplyData = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      toast.success('CV data applied to resume!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            CV Parser & Extractor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {!extractedData && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {parsing ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <FileText className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {parsing ? 'Processing CV...' : 'Drop your CV here or click to browse'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Supports PDF, DOC, DOCX, and TXT files
                  </p>
                </div>
              </div>
            </div>
          )}

          {parsing && (
            <div className="space-y-3">
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-gray-600">
                Extracting information from your CV...
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {extractedData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">CV Parsed Successfully!</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Personal Info</h4>
                  <div className="space-y-1 text-sm">
                    {extractedData.personal.fullName && (
                      <p><span className="font-medium">Name:</span> {extractedData.personal.fullName}</p>
                    )}
                    {extractedData.personal.email && (
                      <p><span className="font-medium">Email:</span> {extractedData.personal.email}</p>
                    )}
                    {extractedData.personal.phone && (
                      <p><span className="font-medium">Phone:</span> {extractedData.personal.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Extracted Data</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">{extractedData.experience.length} Experience</Badge>
                    <Badge variant="secondary">{extractedData.education.length} Education</Badge>
                    <Badge variant="secondary">{extractedData.skills.length} Skills</Badge>
                    <Badge variant="secondary">{extractedData.projects.length} Projects</Badge>
                  </div>
                </div>
              </div>

              {extractedData.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Skills Found</h4>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.slice(0, 10).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
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
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            {extractedData && (
              <Button onClick={handleApplyData} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Apply to Resume
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVParser;
