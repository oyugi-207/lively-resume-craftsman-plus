import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Sparkles, 
  Zap, 
  CheckCircle, 
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Brain,
  X,
  FileEdit
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import PDFGenerator from '@/components/PDFGenerator';

interface CVUploadEditorProps {
  onClose: () => void;
}

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
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
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  languages: Array<{
    id: number;
    language: string;
    proficiency: string;
  }>;
  interests: string[];
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

const CVUploadEditor: React.FC<CVUploadEditorProps> = ({ onClose }) => {
  const { apiKey } = useAPIKey();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // AI-powered extraction using the edge function
  const extractWithAI = async (file: File) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setIsExtracting(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const base64String = fileReader.result as string;
          const base64Content = base64String.split(',')[1];

          const { data: result, error } = await supabase.functions.invoke('cv-reader-ai', {
            body: { 
              fileContent: base64Content,
              fileName: file.name,
              fileType: file.type,
              apiKey
            }
          });

          if (error) throw error;

          if (result?.extractedData) {
            setExtractedData(result.extractedData);
            setActiveTab('edit');
            toast.success('CV data extracted successfully with AI!');
          } else {
            throw new Error('No data could be extracted from your CV.');
          }
        } catch (err: any) {
          console.error('AI extraction error:', err);
          toast.error(err.message || 'AI extraction failed! Try manual extraction instead.');
        } finally {
          setIsExtracting(false);
        }
      };
      fileReader.readAsDataURL(file);
    } catch (err: any) {
      setIsExtracting(false);
      toast.error('Failed to read file for AI extraction');
    }
  };

  // Manual extraction - creates empty structure for user to fill
  const extractManually = () => {
    const emptyData: ResumeData = {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: [{
        id: 1,
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }],
      education: [{
        id: 1,
        school: '',
        degree: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }],
      skills: [],
      certifications: [],
      languages: [],
      interests: [],
      projects: []
    };

    setExtractedData(emptyData);
    setActiveTab('edit');
    toast.success('Manual form ready for editing!');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success('File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleExtractClick = () => {
    if (!uploadedFile) {
      toast.error('Please upload a CV file first');
      return;
    }
    extractWithAI(uploadedFile);
  };

  const downloadOptimizedPDF = async () => {
    if (!extractedData) {
      toast.error('No data available to download');
      return;
    }

    try {
      setIsProcessing(true);
      toast.info('Generating PDF... This may take a moment.');
      
      const filename = `${extractedData.personal.fullName || 'resume'}_${selectedTemplate + 1}.pdf`;
      await PDFGenerator.generateTextPDF(extractedData, selectedTemplate, filename);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      personal: {
        ...extractedData.personal,
        [field]: value
      }
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    if (!extractedData) return;
    const updatedExperience = [...extractedData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setExtractedData({
      ...extractedData,
      experience: updatedExperience
    });
  };

  const addExperience = () => {
    if (!extractedData) return;
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setExtractedData({
      ...extractedData,
      experience: [...extractedData.experience, newExperience]
    });
  };

  const removeExperience = (index: number) => {
    if (!extractedData) return;
    const updatedExperience = extractedData.experience.filter((_, i) => i !== index);
    setExtractedData({
      ...extractedData,
      experience: updatedExperience
    });
  };

  const updateSkills = (skillsText: string) => {
    if (!extractedData) return;
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(s => s);
    setExtractedData({
      ...extractedData,
      skills: skillsArray
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">CV Upload & Editor</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered CV extraction, editing, and export
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload CV
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="flex items-center gap-2" disabled={!extractedData}>
                    <Edit className="w-4 h-4" />
                    Edit Data
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2" disabled={!extractedData}>
                    <Download className="w-4 h-4" />
                    Export PDF
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      {uploadedFile ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">{uploadedFile.name}</span>
                          <Badge variant="secondary">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Drag & drop or click to select PDF, DOC, or DOCX files (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    {uploadedFile && (
                      <Button
                        onClick={() => extractWithAI(uploadedFile)}
                        disabled={isExtracting}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {isExtracting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Extracting with AI...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Extract with AI
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      onClick={extractManually}
                      variant="outline"
                      size="lg"
                      className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                    >
                      <FileEdit className="w-4 h-4 mr-2" />
                      Manual Entry
                    </Button>
                  </div>

                  {uploadedFile && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="text-sm">
                          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Extraction Options:</h4>
                          <ul className="text-blue-800 dark:text-blue-400 space-y-1">
                            <li>• <strong>AI Extract:</strong> Automatically analyzes your CV and fills form fields</li>
                            <li>• <strong>Manual Entry:</strong> Start with empty form to enter details manually</li>
                            <li>• Both options lead to the same full editing experience</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="edit" className="space-y-6">
                  {extractedData && (
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5" />
                            Personal Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              value={extractedData.personal.fullName}
                              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={extractedData.personal.email}
                              onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={extractedData.personal.phone}
                              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={extractedData.personal.location}
                              onChange={(e) => updatePersonalInfo('location', e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="summary">Professional Summary</Label>
                            <Textarea
                              id="summary"
                              value={extractedData.personal.summary}
                              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                              rows={4}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Experience */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Briefcase className="w-5 h-5" />
                              Work Experience
                            </CardTitle>
                            <Button onClick={addExperience} size="sm">
                              Add Experience
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {extractedData.experience.map((exp, index) => (
                            <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">Experience {index + 1}</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label>Position</Label>
                                  <Input
                                    value={exp.position}
                                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Company</Label>
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Start Date</Label>
                                  <Input
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>End Date</Label>
                                  <Input
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                  rows={3}
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Skills */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Award className="w-5 h-5" />
                            Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Label htmlFor="skills">Skills (comma-separated)</Label>
                          <Textarea
                            id="skills"
                            value={extractedData.skills.join(', ')}
                            onChange={(e) => updateSkills(e.target.value)}
                            rows={3}
                            placeholder="JavaScript, React, Node.js, Python..."
                          />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="export" className="space-y-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Export Options</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="template-select">Select Template</Label>
                          <Select value={selectedTemplate.toString()} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Modern Professional</SelectItem>
                              <SelectItem value="1">Executive Leadership</SelectItem>
                              <SelectItem value="2">Creative Designer</SelectItem>
                              <SelectItem value="3">Tech Specialist</SelectItem>
                              <SelectItem value="4">Minimalist Clean</SelectItem>
                              <SelectItem value="5">Corporate Classic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          onClick={downloadOptimizedPDF} 
                          disabled={!extractedData || isProcessing}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          size="lg"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating PDF...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Section */}
            <div className="xl:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Template {selectedTemplate + 1}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 max-h-[600px] overflow-y-auto">
                    {extractedData ? (
                      <div className="transform scale-75 origin-top-left w-[133%] h-auto">
                        <ImprovedResumePreview 
                          data={extractedData}
                          template={selectedTemplate}
                          scale={1}
                        />
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-8 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Upload and extract your CV to see the preview
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVUploadEditor;
