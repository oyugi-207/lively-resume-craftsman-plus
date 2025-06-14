
export interface ResumeData {
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
    description?: string;
    courses?: string;
    honors?: string;
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

export interface TemplateConfig {
  primaryColor: [number, number, number];
  secondaryColor: [number, number, number];
  headerStyle: 'modern' | 'executive' | 'classic' | 'creative' | 'tech';
  fontStyle: 'professional' | 'bold' | 'traditional' | 'modern' | 'clean';
}

export interface PDFContext {
  pdf: any;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  yPosition: number;
  config: TemplateConfig;
}
