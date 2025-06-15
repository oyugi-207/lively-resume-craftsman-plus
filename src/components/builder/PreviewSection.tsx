
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: any[];
  education: any[];
  skills: string[];
  certifications: any[];
  languages: any[];
  interests: string[];
  projects: any[];
  references: any[];
}

interface PreviewSectionProps {
  resumeData: ResumeData;
  selectedTemplate: number;
  previewScale: number;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  resumeData,
  selectedTemplate,
  previewScale
}) => {
  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
      <CardHeader className="pb-2 px-3 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Live Preview
          </CardTitle>
          
          <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            Template {selectedTemplate + 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-gray-50 dark:bg-gray-900 p-1 rounded-b-lg">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-inner max-h-[70vh] overflow-y-auto">
            <ImprovedResumePreview 
              data={resumeData} 
              template={selectedTemplate}
              scale={previewScale}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
