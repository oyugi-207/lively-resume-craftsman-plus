
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface CVUploaderProps {
  onParsed: (data: any) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onParsed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseResult, setParseResult] = useState<any>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file || (!file.type.includes('pdf') && !file.type.includes('word'))) {
      alert('Please upload a PDF or Word document');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload and parsing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate parsing after upload
    setTimeout(() => {
      const mockParsedData = {
        personal: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY',
          summary: 'Experienced software developer with 5+ years in full-stack development.'
        },
        experience: [
          {
            id: 1,
            company: 'Tech Corp',
            position: 'Senior Developer',
            location: 'New York, NY',
            startDate: '2021',
            endDate: 'Present',
            description: 'Led development of web applications using React and Node.js'
          },
          {
            id: 2,
            company: 'StartupXYZ',
            position: 'Frontend Developer',
            location: 'San Francisco, CA',
            startDate: '2019',
            endDate: '2021',
            description: 'Developed responsive user interfaces and improved user experience'
          }
        ],
        education: [
          {
            id: 1,
            school: 'University of Technology',
            degree: 'Bachelor of Computer Science',
            location: 'Boston, MA',
            startDate: '2015',
            endDate: '2019',
            gpa: '3.8'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS'],
        certifications: []
      };

      setParseResult({
        success: true,
        confidence: 95,
        data: mockParsedData
      });
      setIsUploading(false);
      onParsed(mockParsedData);
    }, 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-600" />
          Upload Existing Resume
        </CardTitle>
        <CardDescription>
          Upload your current resume to automatically extract and populate your information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isUploading && !parseResult && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop your resume here
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Supports PDF and Word documents
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
              id="resume-upload"
            />
            <Button asChild>
              <label htmlFor="resume-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading and parsing your resume...
              </p>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {parseResult && (
          <Alert className={parseResult.success ? "border-green-200 bg-green-50 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:bg-red-900/20"}>
            {parseResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              {parseResult.success ? (
                <>
                  Resume parsed successfully with {parseResult.confidence}% confidence. 
                  Your information has been extracted and populated in the form.
                </>
              ) : (
                'Failed to parse resume. Please try uploading a different file or enter your information manually.'
              )}
            </AlertDescription>
          </Alert>
        )}

        {parseResult?.success && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Extracted Information
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Personal information: Name, email, phone, location</li>
              <li>• Work experience: {parseResult.data?.experience?.length || 0} positions</li>
              <li>• Education: {parseResult.data?.education?.length || 0} entries</li>
              <li>• Skills: {parseResult.data?.skills?.length || 0} skills identified</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CVUploader;
