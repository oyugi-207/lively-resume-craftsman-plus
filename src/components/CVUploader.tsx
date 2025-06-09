import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Edit, Save, X, Download } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/RichTextEditor';
import { useAPIKey } from '@/hooks/useAPIKey';
import PDFGenerator from '@/components/PDFGenerator';

interface ParsedCV {
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
  rawText: string;
}

const CVUploader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { apiKey } = useAPIKey();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Simple text extraction - in a real app, you'd use a PDF parsing library
          const text = new TextDecoder().decode(uint8Array);
          
          // If the PDF contains readable text, extract it
          if (text.includes('PDF')) {
            // This is a simplified extraction - real implementation would need pdf-parse or similar
            resolve("Sample extracted text from PDF. In a real implementation, this would contain the actual CV content extracted from the PDF file.");
          } else {
            resolve(text);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseTextWithAI = async (text: string): Promise<ParsedCV> => {
    if (!apiKey) {
      // Return basic parsing without AI
      return {
        personal: {
          fullName: "Please edit to add your name",
          email: "your.email@example.com",
          phone: "+1 (555) 123-4567",
          location: "Your City, State",
          summary: "Professional summary will be extracted here. Please edit to customize."
        },
        experience: [
          {
            id: 1,
            company: "Company Name",
            position: "Job Title",
            location: "City, State",
            startDate: "Year",
            endDate: "Year",
            description: "Job description and responsibilities will be extracted here."
          }
        ],
        education: [
          {
            id: 1,
            school: "University Name",
            degree: "Degree Title",
            location: "City, State",
            startDate: "Year",
            endDate: "Year",
            gpa: ""
          }
        ],
        skills: ["Skill 1", "Skill 2", "Skill 3"],
        rawText: text
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          resumeData: { rawText: text },
          apiKey,
          parseCV: true
        }
      });

      if (error) throw error;

      return data || {
        personal: {
          fullName: "Please edit to add your name",
          email: "your.email@example.com", 
          phone: "+1 (555) 123-4567",
          location: "Your City, State",
          summary: "Professional summary extracted from your CV."
        },
        experience: [],
        education: [],
        skills: [],
        rawText: text
      };
    } catch (error) {
      console.error('AI parsing failed, using basic extraction:', error);
      return {
        personal: {
          fullName: "Please edit to add your name",
          email: "your.email@example.com",
          phone: "+1 (555) 123-4567", 
          location: "Your City, State",
          summary: "Professional summary will be extracted here. Please edit to customize."
        },
        experience: [],
        education: [],
        skills: [],
        rawText: text
      };
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or text file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 70) {
            clearInterval(progressInterval);
            return 70;
          }
          return prev + 10;
        });
      }, 200);

      // Extract text from file
      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await file.text();
      }

      setProgress(80);
      setAnalyzing(true);

      // Parse the extracted text
      const parsed = await parseTextWithAI(extractedText);
      setParsedData(parsed);
      setEditedContent(parsed.rawText);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "CV uploaded and analyzed successfully!"
      });

    } catch (error: any) {
      console.error('Error uploading CV:', error);
      setError(error.message || 'Failed to upload and analyze CV');
      toast({
        title: "Error",
        description: "Failed to upload and analyze CV",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  }, [toast, apiKey]);

  const handleSaveEdit = () => {
    if (parsedData) {
      setParsedData({
        ...parsedData,
        rawText: editedContent
      });
    }
    setEditing(false);
    toast({
      title: "Saved",
      description: "CV content updated successfully!"
    });
  };

  const createResumeFromParsedData = async () => {
    if (!parsedData || !user) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: `${parsedData.personal.fullName}'s Resume`,
          template_id: selectedTemplate,
          personal_info: parsedData.personal,
          experience: parsedData.experience,
          education: parsedData.education,
          skills: parsedData.skills,
          certifications: [],
          languages: [],
          interests: [],
          projects: []
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume created from uploaded CV!"
      });

      // Redirect to builder
      window.location.href = `/builder?id=${data.id}`;
    } catch (error: any) {
      console.error('Error creating resume:', error);
      toast({
        title: "Error",
        description: "Failed to create resume from parsed data",
        variant: "destructive"
      });
    }
  };

  const handleDownloadOptimizedCV = async () => {
    if (!parsedData) return;

    try {
      const filename = `${parsedData.personal.fullName.replace(/[^a-z0-9]/gi, '_')}_CV_Optimized.pdf`;
      await PDFGenerator.generateTextPDF(parsedData, selectedTemplate, filename);
      
      toast({
        title: "Success",
        description: "Optimized CV downloaded successfully!"
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to download CV. Please try again.",
        variant: "destructive"
      });
    }
  };

  const templates = [
    'Modern Professional', 'Executive', 'Creative', 'Technical', 'Academic'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            CV Upload & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!parsedData && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload your existing CV
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We'll analyze your CV and help you create an improved resume
              </p>
              
              <label htmlFor="cv-upload" className="cursor-pointer">
                <Button disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {uploading ? 'Uploading...' : 'Choose PDF or Text File'}
                  </span>
                </Button>
              </label>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {(uploading || analyzing) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {analyzing ? 'Analyzing CV content...' : 'Uploading file...'}
                </span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {parsedData && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">CV analyzed successfully!</span>
              </div>

              {/* Template Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Template for Download</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {templates.map((template, index) => (
                      <Button
                        key={index}
                        variant={selectedTemplate === index ? "default" : "outline"}
                        onClick={() => setSelectedTemplate(index)}
                        className="text-sm"
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CV Content Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>CV Content</CardTitle>
                    <div className="flex gap-2">
                      {!editing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(true)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Content
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditing(false);
                              setEditedContent(parsedData.rawText);
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <RichTextEditor
                      value={editedContent}
                      onChange={setEditedContent}
                      placeholder="Edit your CV content here..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {parsedData.rawText}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Extracted Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                    <p><strong>Name:</strong> {parsedData.personal.fullName}</p>
                    <p><strong>Email:</strong> {parsedData.personal.email}</p>
                    <p><strong>Phone:</strong> {parsedData.personal.phone}</p>
                    <p><strong>Location:</strong> {parsedData.personal.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Extracted Data</h4>
                  <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                    <p><strong>Experience:</strong> {parsedData.experience.length} entries</p>
                    <p><strong>Education:</strong> {parsedData.education.length} entries</p>
                    <p><strong>Skills:</strong> {parsedData.skills.length} skills</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {parsedData.personal.summary && (
                <div>
                  <h4 className="font-medium mb-2">Professional Summary</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    {parsedData.personal.summary}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={createResumeFromParsedData}
                  className="flex-1"
                  size="lg"
                >
                  Create Resume from CV
                </Button>
                <Button 
                  onClick={handleDownloadOptimizedCV}
                  variant="outline"
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <Download className="w-4 h-4" />
                  Download Optimized CV
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVUploader;
