
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CVReaderEnhancedProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVReaderEnhanced: React.FC<CVReaderEnhancedProps> = ({ onDataExtracted, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

  const extractCVData = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a CV file first');
      return;
    }

    setProcessing(true);
    try {
      // Convert file to base64
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const base64Data = fileReader.result as string;
          const base64Content = base64Data.split(',')[1];

          console.log('Calling resume parser API...');
          const { data: result, error } = await supabase.functions.invoke('resume-parser-api', {
            body: { 
              fileContent: base64Content,
              fileName: uploadedFile.name,
              fileType: uploadedFile.type
            }
          });

          if (error) {
            console.error('Resume parser error:', error);
            throw error;
          }

          if (result?.extractedData) {
            console.log('Extracted data:', result.extractedData);
            onDataExtracted(result.extractedData);
            toast.success('CV data extracted successfully with AI!');
            onClose();
          } else {
            toast.error('No data could be extracted from the CV');
          }
        } catch (error: any) {
          console.error('CV processing error:', error);
          toast.error(`Failed to process CV: ${error.message}`);
        } finally {
          setProcessing(false);
        }
      };

      fileReader.readAsDataURL(uploadedFile);
    } catch (error: any) {
      console.error('CV extraction error:', error);
      toast.error(`Failed to extract CV data: ${error.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            AI CV Reader
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your CV and let AI extract the information to auto-fill your resume
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Upload Area */}
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
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                    {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag & drop or click to select PDF, DOC, or DOCX files (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={processing}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            
            <Button
              onClick={extractCVData}
              disabled={!uploadedFile || processing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing CV...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Extract Data with AI
                </>
              )}
            </Button>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">How it works:</h4>
                <ul className="text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• AI reads your CV and extracts personal info, experience, education, and skills</li>
                  <li>• Extracted data is automatically filled into the corresponding form fields</li>
                  <li>• You can review and edit the information before saving</li>
                  <li>• Supports PDF, DOC, and DOCX formats</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVReaderEnhanced;
