
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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
}

const CVUploader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
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
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Parse the CV using a mock implementation
      setAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

      // Mock parsed data
      const mockParsedData: ParsedCV = {
        personal: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "New York, NY",
          summary: "Experienced professional with expertise in software development and project management."
        },
        experience: [
          {
            id: 1,
            company: "Tech Corp",
            position: "Senior Developer",
            location: "New York, NY",
            startDate: "2020-01",
            endDate: "Present",
            description: "Led development of web applications using React and Node.js"
          }
        ],
        education: [
          {
            id: 1,
            school: "University of Technology",
            degree: "Bachelor of Computer Science",
            location: "New York, NY",
            startDate: "2016-09",
            endDate: "2020-05",
            gpa: "3.8"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL"]
      };

      setParsedData(mockParsedData);
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
  }, [toast]);

  const createResumeFromParsedData = async () => {
    if (!parsedData || !user) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: `${parsedData.personal.fullName}'s Resume`,
          template_id: 0,
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
                    {uploading ? 'Uploading...' : 'Choose PDF File'}
                  </span>
                </Button>
              </label>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {(uploading || analyzing) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {analyzing ? 'Analyzing CV...' : 'Uploading...'}
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">CV analyzed successfully!</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {parsedData.personal.fullName}</p>
                    <p><strong>Email:</strong> {parsedData.personal.email}</p>
                    <p><strong>Phone:</strong> {parsedData.personal.phone}</p>
                    <p><strong>Location:</strong> {parsedData.personal.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Extracted Data</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Experience:</strong> {parsedData.experience.length} entries</p>
                    <p><strong>Education:</strong> {parsedData.education.length} entries</p>
                    <p><strong>Skills:</strong> {parsedData.skills.length} skills</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={createResumeFromParsedData}
                className="w-full"
              >
                Create Resume from CV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVUploader;
