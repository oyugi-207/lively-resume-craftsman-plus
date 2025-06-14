
import { ResumeData } from './ResumePreviewProps';

export const enhanceResumeData = (data: ResumeData): ResumeData => {
  // Convert skills to string array if it's in object format
  let skillsArray: string[] = [];
  
  if (data.skills && Array.isArray(data.skills)) {
    if (data.skills.length > 0) {
      // Check if skills are objects with name property
      if (typeof data.skills[0] === 'object' && data.skills[0] !== null && 'name' in data.skills[0]) {
        skillsArray = (data.skills as Array<{name: string; level: string; category: string}>).map(skill => skill.name);
      } else {
        skillsArray = data.skills as string[];
      }
    }
  }
  
  // Add default skills if none provided
  if (skillsArray.length === 0) {
    skillsArray = ['Leadership', 'Strategic Planning', 'Project Management', 'Team Building', 'Problem Solving', 'Communication', 'Data Analysis', 'Process Improvement'];
  }

  return {
    ...data,
    skills: skillsArray,
    
    // Add sample data for preview if sections are empty
    projects: data.projects.length > 0 ? data.projects : [{
      id: 1,
      name: 'Strategic Initiative Project',
      description: 'Led cross-functional team to deliver high-impact business solution\n• Achieved 25% efficiency improvement\n• Managed $500K budget\n• Coordinated with 15+ stakeholders',
      technologies: 'Project Management, Data Analysis, Process Optimization',
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
      'Professional Development', 'Technology Innovation', 'Leadership Excellence'
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
