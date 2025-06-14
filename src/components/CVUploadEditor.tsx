
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Sparkles, 
  Save,
  RefreshCw,
  Bot,
  FileDown,
  Wand2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import CVReaderEnhanced from '@/components/enhanced-forms/CVReaderEnhanced';
import ResumeBuilder from '@/components/ResumeBuilder';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<any>;
  education: Array<any>;
  skills: string[];
  certifications: Array<any>;
  languages: Array<any>;
  interests: string[];
  projects: Array<any>;
}

const CVUploadEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCVReader, setShowCVReader] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const { hasApiKey, getApiKey } = useAPIKey();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast.success('File uploaded successfully!');
      setActiveTab('extract');
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

  const extractWithAI = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    const apiKey = getApiKey('gemini') || getApiKey('openai');
    if (!apiKey) {
      toast.error('Please set your AI API key in Settings');
      return;
    }

    setIsProcessing(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const base64Data = fileReader.result as string;
          const base64Content = base64Data.split(',')[1];

          const { data: result, error } = await supabase.functions.invoke('cv-reader-ai', {
            body: { 
              fileContent: base64Content,
              fileName: uploadedFile.name,
              fileType: uploadedFile.type,
              apiKey 
            }
          });

          if (error) throw error;

          if (result?.extractedData) {
            setResumeData(result.extractedData);
            setActiveTab('edit');
            toast.success('CV data extracted successfully!');
          } else {
            toast.error('No data could be extracted from the CV');
          }
        } catch (error: any) {
          console.error('CV processing error:', error);
          toast.error(`Failed to process CV: ${error.message}`);
        } finally {
          setIsProcessing(false);
        }
      };

      fileReader.readAsDataURL(uploadedFile);
    } catch (error: any) {
      console.error('CV extraction error:', error);
      toast.error(`Failed to extract CV data: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const improveWithAI = async () => {
    if (!resumeData) return;

    const apiKey = getApiKey('gemini') || getApiKey('openai');
    if (!apiKey) {
      toast.error('Please set your AI API key in Settings');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-optimize-resume', {
        body: { 
          resumeData,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.optimizedData) {
        setResumeData(result.optimizedData);
        toast.success('Resume improved with AI suggestions!');
      }
    } catch (error: any) {
      console.error('AI improvement error:', error);
      toast.error('Failed to improve resume with AI');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDataExtracted = (data: any) => {
    setResumeData(data);
    setShowCVReader(false);
    setActiveTab('edit');
    toast.success('CV data loaded successfully!');
  };

  const handleSaveData = (data: any) => {
    setResumeData(data);
    toast.success('Resume data saved!');
  };

  const downloadPDF = async () => {
    if (!resumeData) {
      toast.error('No resume data to download');
      return;
    }

    try {
      // Dynamic import for better performance
      const PDFGenerator = await import('@/components/PDFGenerator');
      await PDFGenerator.default.generateTextPDF(resumeData, selectedTemplate, 'resume.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CV Upload & Editor</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload, edit, and enhance your resume with AI assistance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCVReader(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI CV Reader
          </Button>
          {resumeData && (
            <Button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Editor Area */}
        <div className="xl:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Editor
                {hasApiKey && (
                  <Badge variant="secondary" className="text-xs">
                    AI Powered
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="extract" disabled={!uploadedFile}>
                    <Bot className="w-4 h-4" />
                    Extract
                  </TabsTrigger>
                  <TabsTrigger value="edit" disabled={!resumeData}>
                    <Edit className="w-4 h-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" disabled={!resumeData}>
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Supports PDF, DOC, and DOCX files (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setActiveTab('extract')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Next: Extract Data
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="extract" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">AI Data Extraction</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Use AI to automatically extract and structure your resume data
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={extractWithAI}
                        disabled={!uploadedFile || isProcessing || !hasApiKey}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Extract with AI
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => setShowBuilder(true)}
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Manual Entry
                      </Button>
                    </div>

                    {!hasApiKey && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          💡 Set up your AI API key in Settings to enable automatic extraction
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="edit" className="space-y-4">
                  {resumeData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Edit Resume Data</h3>
                        <div className="flex gap-2">
                          {hasApiKey && (
                            <Button
                              onClick={improveWithAI}
                              disabled={isProcessing}
                              size="sm"
                              variant="outline"
                            >
                              <Wand2 className="w-4 h-4 mr-2" />
                              AI Improve
                            </Button>
                          )}
                          <Button
                            onClick={() => setActiveTab('preview')}
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <ResumeBuilder
                          initialData={resumeData}
                          onSave={handleSaveData}
                          compact={true}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  {resumeData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Resume Preview</h3>
                        <div className="flex gap-2">
                          <Select
                            value={selectedTemplate.toString()}
                            onValueChange={(value) => setSelectedTemplate(parseInt(value))}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Choose template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Modern Professional</SelectItem>
                              <SelectItem value="1">Executive Leadership</SelectItem>
                              <SelectItem value="2">Creative Designer</SelectItem>
                              <SelectItem value="3">Tech Specialist</SelectItem>
                              <SelectItem value="4">Minimalist Clean</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            onClick={downloadPDF}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <FileDown className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                        <ImprovedResumePreview 
                          data={resumeData}
                          template={selectedTemplate}
                          scale={0.8}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Template & Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowCVReader(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI CV Reader
              </Button>
              
              <Button
                onClick={() => setShowBuilder(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Edit className="w-4 h-4 mr-2" />
                Manual Builder
              </Button>
              
              {resumeData && (
                <>
                  <Button
                    onClick={downloadPDF}
                    className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  
                  {hasApiKey && (
                    <Button
                      onClick={improveWithAI}
                      disabled={isProcessing}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Enhance
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {resumeData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="transform scale-50 origin-top-left w-[200%] h-auto border rounded">
                  <ImprovedResumePreview 
                    data={resumeData}
                    template={selectedTemplate}
                    scale={1}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCVReader && (
        <CVReaderEnhanced
          onDataExtracted={handleDataExtracted}
          onClose={() => setShowCVReader(false)}
        />
      )}

      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Resume Builder</h3>
              <Button
                onClick={() => setShowBuilder(false)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <ResumeBuilder
              initialData={resumeData}
              onSave={(data) => {
                handleSaveData(data);
                setShowBuilder(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUploadEditor;
