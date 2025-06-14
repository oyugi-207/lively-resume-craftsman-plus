
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
    <Card className="overflow-hidden shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl sticky top-6">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            Live Preview
          </CardTitle>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant="secondary" className="text-xs">
              Template {selectedTemplate + 1}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-4">
          <ImprovedResumePreview 
            data={resumeData} 
            template={selectedTemplate}
            scale={previewScale}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
