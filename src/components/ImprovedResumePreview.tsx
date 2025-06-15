
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, Phone, Mail, Globe } from 'lucide-react';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
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
    gpa?: string;
    description?: string;
    courses?: string;
    honors?: string;
  }>;
  skills: string[] | Array<{name: string; level: string; category: string}>;
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
  references?: Array<{
    id: number;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

interface ImprovedResumePreviewProps {
  data: ResumeData;
  template?: number;
  scale?: number;
}

const ImprovedResumePreview: React.FC<ImprovedResumePreviewProps> = ({ 
  data, 
  template = 0, 
  scale = 0.3 
}) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate) return '';
    const start = startDate ? new Date(startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    const end = endDate ? new Date(endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
    return `${start} - ${end}`;
  };

  const formatBulletPoints = (description: string) => {
    if (!description) return [];
    return description.split('\n').filter(line => line.trim()).map(line => line.replace(/^[•·‣▪▫-]\s*/, ''));
  };

  const getSkillNames = (skills: string[] | Array<{name: string; level: string; category: string}>) => {
    if (!skills || skills.length === 0) return [];
    
    // Check if it's an array of strings
    if (typeof skills[0] === 'string') {
      return skills as string[];
    }
    
    // If it's an array of objects, extract the name property
    return (skills as Array<{name: string; level: string; category: string}>).map(skill => skill.name);
  };

  return (
    <div 
      className="bg-white text-black p-8 font-sans leading-relaxed shadow-lg"
      style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
        minHeight: '1056px', // A4 height
        maxWidth: '816px' // A4 width
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
        <h1 className="text-4xl font-bold text-blue-800 mb-3">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center items-center gap-6 text-gray-700 text-sm">
          {data.personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {data.personal.email}
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {data.personal.phone}
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {data.personal.location}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personal.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <div className="text-blue-600 font-medium">{exp.company}</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}
                </div>
              </div>
              {exp.description && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {formatBulletPoints(exp.description).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-gray-300 pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                  <div className="text-blue-600 font-medium">{edu.school}</div>
                  {edu.gpa && (
                    <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </div>
                  {edu.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Projects - Only show if projects exist */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-gray-300 pb-1">
            KEY PROJECTS
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  {project.technologies && (
                    <div className="text-sm text-blue-600 font-medium">
                      Technologies: {project.technologies}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateRange(project.startDate, project.endDate)}
                    </div>
                  )}
                  {project.link && (
                    <div className="flex items-center gap-1 mt-1">
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-blue-600">Link: {project.link}</span>
                    </div>
                  )}
                </div>
              </div>
              {project.description && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {formatBulletPoints(project.description).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
            TECHNICAL SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {getSkillNames(data.skills).map((skillName, index) => (
              <Badge key={index} variant="outline" className="text-gray-700 border-gray-400">
                {skillName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-gray-300 pb-1">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                  <div className="text-blue-600">{cert.issuer}</div>
                  {cert.credentialId && (
                    <div className="text-sm text-gray-600">ID: {cert.credentialId}</div>
                  )}
                </div>
                <div className="text-sm text-gray-600">{cert.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
            LANGUAGES
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-800">{lang.language}</span>
                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests && data.interests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
            INTERESTS
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-gray-700 border-gray-400">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedResumePreview;
