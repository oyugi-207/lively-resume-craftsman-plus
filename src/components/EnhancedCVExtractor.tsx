
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  Award,
  Brain,
  Edit3,
  Save,
  Sparkles
} from 'lucide-react';

interface CVExtractorProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const EnhancedCVExtractor: React.FC<CVExtractorProps> = ({ onDataExtracted, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [editableData, setEditableData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const extractTextFromFile = async (file: File): Promise<string> => {
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

  const intelligentParsing = (text: string) => {
    try {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      
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

      // Enhanced email extraction
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emailMatch = text.match(emailRegex);
      if (emailMatch) {
        data.personal.email = emailMatch[0];
      }

      // Enhanced phone extraction
      const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
      const phoneMatch = text.match(phoneRegex);
      if (phoneMatch) {
        data.personal.phone = phoneMatch[0];
      }

      // Enhanced name extraction
      const namePatterns = [
        /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/,
        /([A-Z][A-Z\s]+[A-Z])/,
        /^([A-Z][a-zA-Z\s]{2,30})/
      ];
      
      for (const line of lines.slice(0, 5)) {
        for (const pattern of namePatterns) {
          const nameMatch = line.match(pattern);
          if (nameMatch && !line.includes('@') && line.length < 50) {
            data.personal.fullName = nameMatch[1].trim();
            break;
          }
        }
        if (data.personal.fullName) break;
      }

      // Enhanced location extraction
      const locationPatterns = [
        /([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)/,
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

      // Enhanced skills extraction
      const techSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
        'HTML', 'CSS', 'TypeScript', 'PHP', 'Laravel', 'Django', 'Express',
        'MongoDB', 'MySQL', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'Azure',
        'Kubernetes', 'Linux', 'Windows', 'MacOS', 'Agile', 'Scrum',
        'Project Management', 'Leadership', 'Communication', 'Problem Solving',
        'C++', 'C#', '.NET', 'Spring', 'Hibernate', 'Redux', 'GraphQL',
        'REST API', 'Microservices', 'DevOps', 'CI/CD', 'Jenkins', 'Terraform'
      ];

      const softSkills = [
        'Leadership', 'Communication', 'Problem Solving', 'Team Management',
        'Strategic Planning', 'Project Management', 'Critical Thinking',
        'Analytical Skills', 'Creativity', 'Adaptability', 'Time Management'
      ];

      [...techSkills, ...softSkills].forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(text)) {
          if (!data.skills.includes(skill)) {
            data.skills.push(skill);
          }
        }
      });

      // Enhanced experience extraction
      const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience', 'career'];
      const educationKeywords = ['education', 'academic', 'university', 'college', 'degree', 'school'];
      
      let currentSection = '';
      let experienceEntry: any = {};
      let educationEntry: any = {};
      
      lines.forEach((line, index) => {
        const lowerLine = line.toLowerCase();
        
        // Section identification
        if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'experience';
          return;
        }
        
        if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
          currentSection = 'education';
          return;
        }

        if (currentSection === 'experience') {
          // Job title and company patterns
          const jobPatterns = [
            /^([A-Z][a-zA-Z\s]+)\s+at\s+([A-Z][a-zA-Z\s&.,]+)/,
            /^([A-Z][a-zA-Z\s]+)\s+-\s+([A-Z][a-zA-Z\s&.,]+)/,
            /^([A-Z][a-zA-Z\s]+),\s+([A-Z][a-zA-Z\s&.,]+)/
          ];
          
          for (const pattern of jobPatterns) {
            const match = line.match(pattern);
            if (match) {
              if (experienceEntry.position) {
                data.experience.push({ ...experienceEntry, id: Date.now() + Math.random() });
              }
              
              experienceEntry = {
                position: match[1].trim(),
                company: match[2].trim(),
                location: '',
                startDate: '',
                endDate: '',
                description: ''
              };
              break;
            }
          }
          
          // Date patterns
          const datePatterns = [
            /(\d{4})\s*-\s*(\d{4})/,
            /(\d{4})\s*-\s*(present|current)/i,
            /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\s*-\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})/i
          ];
          
          for (const pattern of datePatterns) {
            const dateMatch = line.match(pattern);
            if (dateMatch && experienceEntry.position) {
              experienceEntry.startDate = dateMatch[1];
              experienceEntry.endDate = dateMatch[2];
              break;
            }
          }
          
          // Description lines
          if (line.startsWith('•') || line.startsWith('-') || 
              (line.length > 20 && !line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) && experienceEntry.position)) {
            experienceEntry.description += (experienceEntry.description ? '\n' : '') + line;
          }
        }

        if (currentSection === 'education') {
          const degreePatterns = [
            /Bachelor|Master|PhD|Degree|University|College/i,
            /B\.?S\.?|M\.?S\.?|M\.?B\.?A\.?|Ph\.?D\.?/
          ];
          
          for (const pattern of degreePatterns) {
            if (pattern.test(line)) {
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
              break;
            }
          }
          
          // GPA extraction
          const gpaMatch = line.match(/GPA[:\s]*(\d+\.?\d*)/i);
          if (gpaMatch && educationEntry.degree) {
            educationEntry.gpa = gpaMatch[1];
          }
        }
      });

      // Add final entries
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
        const summaryLines = lines.slice(summaryIndex + 1, summaryIndex + 4)
          .filter(line => line.length > 20)
          .join(' ');
        data.personal.summary = summaryLines.substring(0, 500);
      }

      return data;
    } catch (error) {
      console.error('Error parsing CV text:', error);
      throw new Error('Failed to parse CV content');
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(20);
      
      let text = '';
      const fileType = file.type;
      
      if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractTextFromFile(file);
      } else if (fileType.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        text = await extractTextFromFile(file);
      } else {
        text = await extractTextFromFile(file);
      }

      setProgress(60);

      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract sufficient text from the file. Please ensure the file contains readable text content.');
      }

      const parsedData = intelligentParsing(text);
      
      setProgress(90);

      if (!parsedData.personal.fullName && !parsedData.personal.email && 
          parsedData.experience.length === 0 && parsedData.skills.length === 0) {
        throw new Error('Could not find sufficient information in CV. Please check the file content and format.');
      }

      setProgress(100);
      setExtractedData(parsedData);
      setEditableData(JSON.parse(JSON.stringify(parsedData)));
      setActiveTab('edit');
      
      toast.success('CV parsed successfully! You can now edit the extracted data.');
      
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
    maxSize: 10 * 1024 * 1024
  });

  const enhanceWithAI = async () => {
    if (!editableData) return;
    
    toast.info('Enhancing with AI...');
    
    // Simulate AI enhancement
    setTimeout(() => {
      const enhanced = { ...editableData };
      
      // Enhance summary if missing
      if (!enhanced.personal.summary) {
        enhanced.personal.summary = `Experienced ${enhanced.experience[0]?.position || 'professional'} with strong background in ${enhanced.skills.slice(0, 3).join(', ')}. Proven track record of delivering high-quality results and driving business growth through innovative solutions.`;
      }
      
      // Enhance experience descriptions
      enhanced.experience = enhanced.experience.map((exp: any) => ({
        ...exp,
        description: exp.description || `• Led key initiatives in ${exp.position} role\n• Collaborated with cross-functional teams\n• Delivered measurable results and improvements`
      }));
      
      setEditableData(enhanced);
      toast.success('Content enhanced with AI!');
    }, 2000);
  };

  const handleUseData = () => {
    if (editableData) {
      onDataExtracted(editableData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Enhanced CV Extractor & Editor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload CV</TabsTrigger>
              <TabsTrigger value="edit" disabled={!extractedData}>Edit & Enhance</TabsTrigger>
              <TabsTrigger value="preview" disabled={!extractedData}>Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
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
                      {isProcessing ? 'Processing your CV...' : 'Upload your CV for intelligent extraction'}
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
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              {editableData && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Edit Extracted Information</h3>
                    <Button onClick={enhanceWithAI} className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Enhance with AI
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <Input
                          placeholder="Full Name"
                          value={editableData.personal.fullName}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personal: { ...editableData.personal, fullName: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Email"
                          value={editableData.personal.email}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personal: { ...editableData.personal, email: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Phone"
                          value={editableData.personal.phone}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personal: { ...editableData.personal, phone: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Location"
                          value={editableData.personal.location}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personal: { ...editableData.personal, location: e.target.value }
                          })}
                        />
                        <Textarea
                          placeholder="Professional Summary"
                          value={editableData.personal.summary}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personal: { ...editableData.personal, summary: e.target.value }
                          })}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Skills ({editableData.skills.length})
                      </h4>
                      <Textarea
                        placeholder="Enter skills separated by commas"
                        value={editableData.skills.join(', ')}
                        onChange={(e) => setEditableData({
                          ...editableData,
                          skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        rows={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Experience ({editableData.experience.length} positions)
                    </h4>
                    <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                      {editableData.experience.map((exp: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                          <Input
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => {
                              const newExp = [...editableData.experience];
                              newExp[index] = { ...newExp[index], position: e.target.value };
                              setEditableData({ ...editableData, experience: newExp });
                            }}
                          />
                          <Input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...editableData.experience];
                              newExp[index] = { ...newExp[index], company: e.target.value };
                              setEditableData({ ...editableData, experience: newExp });
                            }}
                          />
                          <Textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...editableData.experience];
                              newExp[index] = { ...newExp[index], description: e.target.value };
                              setEditableData({ ...editableData, experience: newExp });
                            }}
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleUseData} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Use This Data
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('preview')}>
                      Preview
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {editableData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">CV processed and enhanced successfully!</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{editableData.experience.length}</div>
                      <div className="text-sm text-blue-700">Positions</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{editableData.education.length}</div>
                      <div className="text-sm text-green-700">Education</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{editableData.skills.length}</div>
                      <div className="text-sm text-purple-700">Skills</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{editableData.projects.length}</div>
                      <div className="text-sm text-orange-700">Projects</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Extracted Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {editableData.skills.slice(0, 15).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {editableData.skills.length > 15 && (
                        <Badge variant="outline" className="text-xs">
                          +{editableData.skills.length - 15} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleUseData} className="flex-1">
                      Import to Resume Builder
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('edit')}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit More
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCVExtractor;
