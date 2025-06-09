
import React from 'react';
import { 
  ModernProfessionalTemplate, 
  ExecutiveTemplate, 
  CreativeTemplate, 
  TechTemplate, 
  MinimalistTemplate 
} from './ResumeTemplates';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  languages: Array<{
    id: number;
    language: string;
    proficiency: string;
  }>;
  interests: string[];
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
  jobDescription?: string;
}

interface ResumePreviewProps {
  data: ResumeData;
  template: number;
  scale?: number;
}

const ImprovedResumePreview: React.FC<ResumePreviewProps> = ({ data, template, scale = 1 }) => {
  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
  };

  // Template components mapping
  const templates = [
    ModernProfessionalTemplate,   // 0 - Modern Professional
    ExecutiveTemplate,            // 1 - Executive Leadership  
    CreativeTemplate,             // 2 - Creative Designer
    TechTemplate,                 // 3 - Tech Specialist
    MinimalistTemplate,           // 4 - Minimalist Clean
    ModernProfessionalTemplate,   // 5 - Corporate Classic (variation)
    ExecutiveTemplate,            // 6 - Two Column Layout (variation)
    CreativeTemplate,             // 7 - Academic Scholar (variation)
    TechTemplate,                 // 8 - Sales Champion (variation)
    MinimalistTemplate,           // 9 - Startup Innovator (variation)
    ModernProfessionalTemplate,   // 10 - Healthcare Professional (variation)
    ExecutiveTemplate,            // 11 - Finance Expert (variation)
    CreativeTemplate,             // 12 - Marketing Creative (variation)
    TechTemplate,                 // 13 - Engineering Focus (variation)
    MinimalistTemplate,           // 14 - Legal Professional (variation)
    ModernProfessionalTemplate,   // 15 - Consulting Elite (variation)
  ];

  const SelectedTemplate = templates[template] || ModernProfessionalTemplate;

  return (
    <div style={containerStyle} className="w-full">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200" 
           style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="p-8 h-full">
          <SelectedTemplate data={data} templateId={template} />
        </div>
      </div>
    </div>
  );
};

export default ImprovedResumePreview;
