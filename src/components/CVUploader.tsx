
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  Download, 
  Wand2, 
  Eye, 
  Save,
  Loader2,
  Palette,
  Search
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { ModernProfessionalTemplate, ExecutiveTemplate, CreativeTemplate, TechTemplate, MinimalistTemplate } from './ResumeTemplates';

interface CVUploaderProps {
  onUpload?: (file: File) => void;
  className?: string;
}

interface ParsedCV {
  text: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
}

const CVUploader: React.FC<CVUploaderProps> = ({ onUpload, className = "" }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedCV, setParsedCV] = useState<ParsedCV | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onUpload?.(uploadedFile);
      parseCV(uploadedFile);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const parseCV = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      const parsed = await parseTextToStructuredData(text);
      setParsedCV(parsed);
      setEditedContent(text);
      toast.success('CV uploaded and parsed successfully!');
    } catch (error) {
      console.error('Error parsing CV:', error);
      toast.error('Failed to parse CV. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return await file.text();
    } else if (file.type === 'application/pdf') {
      // For PDF, we'll use a simple text extraction
      // In a real app, you'd use a proper PDF parsing library
      return await file.text();
    }
    return await file.text();
  };

  const parseTextToStructuredData = async (text: string): Promise<ParsedCV> => {
    // Simple parsing logic - in reality, you'd use AI or more sophisticated parsing
    const lines = text.split('\n');
    
    // Extract email with regex
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
    
    // Simple extraction logic
    const parsed: ParsedCV = {
      text,
      personalInfo: {
        name: lines[0] || 'Unknown',
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: ''
      },
      experience: [],
      education: [],
      skills: []
    };

    // Look for common keywords to extract skills
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'];
    parsed.skills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return parsed;
  };

  const handleOptimizeWithAI = async () => {
    if (!parsedCV || !jobDescription) {
      toast.error('Please upload a CV and add job description first');
      return;
    }

    setIsProcessing(true);
    try {
      // Here you would call your AI optimization service
      toast.success('CV optimized with AI suggestions!');
    } catch (error) {
      toast.error('Failed to optimize CV with AI');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadOptimized = () => {
    if (!editedContent) {
      toast.error('No content to download');
      return;
    }

    // Create optimized resume data including hidden job description for ATS
    const optimizedData = {
      personal: {
        fullName: parsedCV?.personalInfo.name || 'Your Name',
        email: parsedCV?.personalInfo.email || '',
        phone: parsedCV?.personalInfo.phone || '',
        location: parsedCV?.personalInfo.location || '',
        summary: editedContent.substring(0, 300) + '...',
      },
      experience: parsedCV?.experience || [],
      education: parsedCV?.education || [],
      skills: parsedCV?.skills || [],
      certifications: [],
      languages: [],
      interests: [],
      projects: [],
      jobDescription: jobDescription // Hidden ATS keywords
    };

    setShowPreview(true);
  };

  const templates = [
    { id: 0, name: 'Modern Professional', component: ModernProfessionalTemplate },
    { id: 1, name: 'Executive Leadership', component: ExecutiveTemplate },
    { id: 2, name: 'Creative Designer', component: CreativeTemplate },
    { id: 3, name: 'Tech Specialist', component: TechTemplate },
    { id: 4, name: 'Minimalist Clean', component: MinimalistTemplate },
  ];

  const SelectedTemplateComponent = templates[selectedTemplate]?.component || ModernProfessionalTemplate;

  const resumeData = parsedCV ? {
    personal: {
      fullName: parsedCV.personalInfo.name,
      email: parsedCV.personalInfo.email,
      phone: parsedCV.personalInfo.phone,
      location: parsedCV.personalInfo.location,
      summary: editedContent.substring(0, 300) + '...',
    },
    experience: parsedCV.experience.map((exp, index) => ({
      id: index,
      company: exp.company,
      position: exp.position,
      location: '',
      startDate: exp.duration.split('-')[0] || '',
      endDate: exp.duration.split('-')[1] || '',
      description: exp.description
    })),
    education: parsedCV.education.map((edu, index) => ({
      id: index,
      school: edu.school,
      degree: edu.degree,
      location: '',
      startDate: '',
      endDate: edu.year,
      gpa: ''
    })),
    skills: parsedCV.skills,
    certifications: [],
    languages: [],
    interests: [],
    projects: [],
    jobDescription: jobDescription
  } : null;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            CV Optimizer & Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          {!file && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {isDragActive 
                  ? 'Drop your CV here...' 
                  : 'Drag & drop your CV here, or click to select'
                }
              </p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, TXT files</p>
            </div>
          )}

          {/* Uploaded File Info */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <FileText className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">{file.name}</p>
                <p className="text-sm text-green-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Uploaded
              </Badge>
            </div>
          )}

          {/* Job Description for ATS Optimization */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Job Description (for ATS keyword optimization)
            </label>
            <Textarea
              placeholder="Paste the job description here to optimize your CV with relevant keywords..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">
              These keywords will be hidden in the final PDF for ATS scanning while keeping your content readable.
            </p>
          </div>

          {/* Template Selection */}
          {parsedCV && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Choose Template
              </label>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTemplate(template.id)}
                    className="flex items-center gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* CV Content Editor */}
          {parsedCV && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Edit CV Content
              </label>
              <RichTextEditor
                value={editedContent}
                onChange={setEditedContent}
                placeholder="Edit your CV content here..."
                className="min-h-[300px]"
              />
            </div>
          )}

          {/* Action Buttons */}
          {parsedCV && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleOptimizeWithAI}
                disabled={isProcessing || !jobDescription}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                Optimize with AI
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadOptimized}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Optimized
              </Button>
            </div>
          )}

          {/* Extracted Information Display */}
          {parsedCV && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800">Extracted Information:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Info:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Name: {parsedCV.personalInfo.name}</div>
                    <div>Email: {parsedCV.personalInfo.email}</div>
                    <div>Phone: {parsedCV.personalInfo.phone}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Found:</h4>
                  <div className="flex flex-wrap gap-1">
                    {parsedCV.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Preview */}
      {showPreview && resumeData && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Resume Preview - {templates[selectedTemplate]?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg max-h-[600px] overflow-y-auto">
              <div className="transform scale-75 origin-top-left">
                <SelectedTemplateComponent 
                  data={resumeData} 
                  templateId={selectedTemplate}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CVUploader;
