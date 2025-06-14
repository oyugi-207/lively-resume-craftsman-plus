
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

interface ModernCreativeTemplateProps {
  data: ResumeData;
}

const ModernCreativeTemplate: React.FC<ModernCreativeTemplateProps> = ({ data }) => {
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
    <div className="bg-white text-gray-900 max-w-4xl mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              {data.personal.email && (
                <span className="flex items-center gap-2">
                  <span>📧</span> {data.personal.email}
                </span>
              )}
              {data.personal.phone && (
                <span className="flex items-center gap-2">
                  <span>📱</span> {data.personal.phone}
                </span>
              )}
              {data.personal.location && (
                <span className="flex items-center gap-2">
                  <span>📍</span> {data.personal.location}
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-3 text-blue-100">
              {data.personal.linkedin && (
                <span className="flex items-center gap-2">
                  <span>💼</span> LinkedIn
                </span>
              )}
              {data.personal.github && (
                <span className="flex items-center gap-2">
                  <span>👨‍💻</span> GitHub
                </span>
              )}
              {data.personal.website && (
                <span className="flex items-center gap-2">
                  <span>🌐</span> Portfolio
                </span>
              )}
            </div>
          </div>
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl">
            👤
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 bg-gray-50 p-6 space-y-6">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.slice(0, 12).map((skill, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg shadow-sm border-l-4 border-blue-600">
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-600">
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium">{lang.language}</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-600">
                Certifications
              </h3>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-800">{cert.name}</h4>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-green-600">{formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-600">
                Interests
              </h3>
              <div className="flex flex-wrap gap-1">
                {data.interests.map((interest, index) => (
                  <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 p-6 space-y-6">
          {/* Professional Summary */}
          {data.personal.summary && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-4 border-blue-200">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-0"></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-600">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-purple-600 font-medium">{edu.school}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        {edu.location && <p>{edu.location}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-600">
                Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-green-600 font-medium">
                        Technologies: {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernCreativeTemplate;
