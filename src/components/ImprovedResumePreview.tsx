
import React from 'react';
import { ResumePreviewProps } from './preview/ResumePreviewProps';
import { templates } from './preview/templateMapping';
import { enhanceResumeData } from './preview/dataEnhancer';
import { ModernProfessionalTemplate } from './ResumeTemplates';

const ImprovedResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  template, 
  scale = 1, 
  customColors 
}) => {
  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
  };

  // Ensure we have a valid template
  const SelectedTemplate = templates[template] || ModernProfessionalTemplate;

  // Enhance data with sample content for preview
  const enhancedData = enhanceResumeData(data);

  return (
    <div style={containerStyle} className="w-full">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200" 
           style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="w-full h-full">
          <SelectedTemplate data={enhancedData} customColors={customColors} />
        </div>
      </div>
    </div>
  );
};

export default ImprovedResumePreview;
