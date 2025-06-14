
import React from 'react';

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
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  interests?: string[];
}

interface MinimalistElegantTemplateProps {
  data: ResumeData;
}

const MinimalistElegantTemplate: React.FC<MinimalistElegantTemplateProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString === 'Present') return 'Present';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Minimal Header */}
      <div className="border-b-2 border-gray-900 p-8 pb-6">
        <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-wide">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-8 text-sm text-gray-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>LinkedIn</span>}
          {data.personal.website && <span>Portfolio</span>}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        {data.personal.summary && (
          <div>
            <p className="text-gray-700 leading-relaxed font-light text-lg">
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                      <p className="text-gray-600 font-light">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500 font-light">
                      <p>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed font-light whitespace-pre-line mt-3">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600 font-light">{edu.school}</p>
                      {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-500 font-light">
                      <p>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                      {edu.location && <p>{edu.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <span key={index} className="text-sm text-gray-700 border-b border-gray-300 pb-1">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-700 text-sm font-light mb-2">{project.description}</p>
                  {project.technologies && (
                    <p className="text-xs text-gray-500 font-light">
                      {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Certifications */}
        <div className="grid grid-cols-2 gap-8">
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">{lang.language}</span>
                    <span className="text-gray-500 font-light">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.interests && data.interests.length > 0 && (
            <div>
              <h2 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-sm text-gray-600 font-light">
                    {interest}{index < data.interests!.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistElegantTemplate;
