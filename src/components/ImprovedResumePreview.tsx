import React from 'react';
import { 
  ModernProfessionalTemplate, 
  ExecutiveTemplate, 
  CreativeTemplate, 
  TechTemplate, 
  MinimalistTemplate,
  CorporateClassicTemplate,
  ProfessionalBlueTemplate,
  LegalProfessionalTemplate,
  EngineeringFocusTemplate,
  DataSpecialistTemplate,
  SupplyChainTemplate,
  CleanModernTemplate,
  MarketingCreativeTemplate,
  AcademicScholarTemplate,
  SalesChampionTemplate,
  ConsultingEliteTemplate
} from './ResumeTemplates';
import ModernCreativeTemplate from './ResumeTemplates/ModernCreativeTemplate';
import CreativePortfolioTemplate from './ResumeTemplates/CreativePortfolioTemplate';
import MinimalistElegantTemplate from './ResumeTemplates/MinimalistElegantTemplate';
import TechInnovatorTemplate from './ResumeTemplates/TechInnovatorTemplate';
import ExecutiveEliteTemplate from './ResumeTemplates/ExecutiveEliteTemplate';
import CreativeDesignerTemplate from './ResumeTemplates/CreativeDesignerTemplate';

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
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

const ImprovedResumePreview: React.FC<ResumePreviewProps> = ({ data, template, scale = 1, customColors }) => {
  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
  };

  // Complete template mapping with all templates including the new ones
  const templates = [
    ModernProfessionalTemplate,     // 0 - Modern Professional
    ExecutiveTemplate,              // 1 - Executive Leadership  
    CreativeTemplate,               // 2 - Creative Designer
    TechTemplate,                   // 3 - Tech Specialist
    MinimalistTemplate,             // 4 - Minimalist Clean
    CorporateClassicTemplate,       // 5 - Corporate Classic
    ProfessionalBlueTemplate,       // 6 - Professional Blue
    LegalProfessionalTemplate,      // 7 - Legal Professional
    EngineeringFocusTemplate,       // 8 - Engineering Focus
    DataSpecialistTemplate,         // 9 - Data Specialist
    SupplyChainTemplate,            // 10 - Supply Chain Manager
    CleanModernTemplate,            // 11 - Clean Modern
    MarketingCreativeTemplate,      // 12 - Marketing Creative
    AcademicScholarTemplate,        // 13 - Academic Scholar
    SalesChampionTemplate,          // 14 - Sales Champion
    ConsultingEliteTemplate,        // 15 - Consulting Elite
    ModernCreativeTemplate,         // 16 - Modern Creative
    CreativePortfolioTemplate,      // 17 - Creative Portfolio
    MinimalistElegantTemplate,      // 18 - Minimalist Elegant
    TechInnovatorTemplate,          // 19 - Tech Innovator
    ExecutiveEliteTemplate,         // 20 - Executive Elite
    CreativeDesignerTemplate,       // 21 - Creative Designer Pro
  ];

  // Ensure we have a valid template
  const SelectedTemplate = templates[template] || ModernProfessionalTemplate;

  // Add sample data for empty sections to ensure preview shows all capabilities
  const enhancedData = {
    ...data,
    // Add sample skills if none exist
    skills: data.skills.length > 0 ? data.skills : [
      'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'
    ],
    // Add sample project if none exist
    projects: data.projects.length > 0 ? data.projects : [{
      id: 1,
      name: 'Sample Project',
      description: 'Professional project showcasing skills and expertise',
      technologies: 'Various Technologies',
      link: '',
      startDate: '2023',
      endDate: '2024'
    }],
    // Add sample certifications if none exist
    certifications: data.certifications.length > 0 ? data.certifications : [{
      id: 1,
      name: 'Professional Certification',
      issuer: 'Industry Organization',
      date: '2024',
      credentialId: ''
    }],
    // Add sample languages if none exist
    languages: data.languages.length > 0 ? data.languages : [{
      id: 1,
      language: 'English',
      proficiency: 'Native'
    }],
    // Add sample interests if none exist
    interests: data.interests.length > 0 ? data.interests : [
      'Professional Development', 'Technology', 'Innovation'
    ]
  };

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
