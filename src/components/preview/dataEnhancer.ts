
import { ResumeData } from './ResumePreviewProps';

export const enhanceResumeData = (data: ResumeData): ResumeData => {
  return {
    ...data,
    // Normalize skills to string array for template compatibility
    skills: data.skills.length > 0 ? 
      (Array.isArray(data.skills) && typeof data.skills[0] === 'object' 
        ? (data.skills as Array<{name: string; level: string; category: string}>).map(skill => skill.name)
        : data.skills as string[]
      ) : ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management'],
    
    // Add sample data for preview if sections are empty
    projects: data.projects.length > 0 ? data.projects : [{
      id: 1,
      name: 'Sample Project',
      description: 'Professional project showcasing skills and expertise',
      technologies: 'Various Technologies',
      link: '',
      startDate: '2023',
      endDate: '2024'
    }],
    
    certifications: data.certifications.length > 0 ? data.certifications : [{
      id: 1,
      name: 'Professional Certification',
      issuer: 'Industry Organization',
      date: '2024',
      credentialId: ''
    }],
    
    languages: data.languages.length > 0 ? data.languages : [{
      id: 1,
      language: 'English',
      proficiency: 'Native'
    }],
    
    interests: data.interests.length > 0 ? data.interests : [
      'Professional Development', 'Technology', 'Innovation'
    ],
    
    references: data.references && data.references.length > 0 ? data.references : [{
      id: 1,
      name: 'Professional Reference',
      title: 'Senior Manager',
      company: 'Previous Company',
      email: 'reference@company.com',
      phone: '+1 (555) 123-4567',
      relationship: 'Former Supervisor'
    }]
  };
};
