
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import CVDataExtractor from './CVDataExtractor';

interface CVReaderEnhancedProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVReaderEnhanced: React.FC<CVReaderEnhancedProps> = ({ onDataExtracted, onClose }) => {
  const [showExtractor, setShowExtractor] = useState(false);

  if (showExtractor) {
    return (
      <CVDataExtractor
        onDataExtracted={onDataExtracted}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            CV Reader & Editor
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Extract, view, and enhance your CV data with our advanced document reader
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-300">Read Document</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">Extract all data from your CV file</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-green-900 dark:text-green-300">Review Data</h4>
              <p className="text-xs text-green-700 dark:text-green-400">See exactly what was extracted</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-300">AI Enhance</h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">Optionally improve with AI</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">How it works:</h4>
                <ul className="text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Upload your CV in PDF, DOC, DOCX, or TXT format</li>
                  <li>• We extract and display ALL the text and data from your document</li>
                  <li>• Review the extracted information to ensure accuracy</li>
                  <li>• Optionally enhance the content with AI suggestions</li>
                  <li>• Use the extracted data to fill your resume builder</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => setShowExtractor(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start CV Extraction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVReaderEnhanced;
