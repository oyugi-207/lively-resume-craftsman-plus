
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Zap } from 'lucide-react';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';

interface PreviewSectionProps {
  resumeData: any;
  selectedTemplate: number;
  previewScale?: number;
  customColors?: any;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  resumeData,
  selectedTemplate,
  previewScale = 0.6,
  customColors
}) => {
  return (
    <Card className="overflow-hidden shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl sticky top-6">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            Live Preview
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Template {selectedTemplate + 1}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4">
          <ImprovedResumePreview 
            data={resumeData} 
            template={selectedTemplate}
            scale={previewScale}
            customColors={customColors}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
