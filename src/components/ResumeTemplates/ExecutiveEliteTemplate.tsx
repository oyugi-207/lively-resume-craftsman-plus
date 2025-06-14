
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

interface ExecutiveEliteTemplateProps {
  data: ResumeData;
}

const ExecutiveEliteTemplate: React.FC<ExecutiveEliteTemplateProps> = ({ data }) => {
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
      {/* Luxury Executive Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-400/20 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-serif mb-4 tracking-tight text-gold-300">
            {data.personal.fullName || 'Executive Name'}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-gold-400 to-gold-600 mb-4"></div>
          <div className="grid grid-cols-2 gap-8 text-gray-300">
            <div className="space-y-2">
              {data.personal.email && (
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold-400 rounded-full"></span>
                  {data.personal.email}
                </p>
              )}
              {data.personal.phone && (
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold-400 rounded-full"></span>
                  {data.personal.phone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {data.personal.location && (
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold-400 rounded-full"></span>
                  {data.personal.location}
                </p>
              )}
              {data.personal.linkedin && (
                <p className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold-400 rounded-full"></span>
                  LinkedIn Profile
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Executive Summary */}
        {data.personal.summary && (
          <div className="border-l-4 border-gold-500 pl-6">
            <h2 className="text-2xl font-serif text-gray-900 mb-4 tracking-wide">
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-light">
              {data.personal.summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-gray-900 mb-6 tracking-wide border-b-2 border-gold-500 pb-2">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-gold-400 to-gold-600"></div>
                  <div className="pl-8">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{exp.position}</h3>
                        <p className="text-lg text-gold-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                          {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                        </p>
                        {exp.location && <p className="text-sm text-gray-500 mt-1">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Qualifications */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-gray-900 mb-6 tracking-wide border-b-2 border-gold-500 pb-2">
              Education & Qualifications
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-gold-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gold-600 font-medium">{edu.school}</p>
                      {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </p>
                      {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Competencies */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-gray-900 mb-6 tracking-wide border-b-2 border-gold-500 pb-2">
              Core Competencies
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded border-b-2 border-gold-400">
                  <span className="text-gray-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-8">
          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-xl font-serif text-gray-900 mb-4 border-b border-gold-300 pb-2">
                Languages
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{lang.language}</span>
                    <span className="text-sm text-gold-600 bg-gold-100 px-2 py-1 rounded">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-xl font-serif text-gray-900 mb-4 border-b border-gold-300 pb-2">
                Professional Interests
              </h3>
              <div className="space-y-1">
                {data.interests.map((interest, index) => (
                  <p key={index} className="text-gray-700">
                    • {interest}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-gray-900 mb-6 tracking-wide border-b-2 border-gold-500 pb-2">
              Professional Certifications
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded border-l-4 border-gold-400">
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p className="text-gold-600 text-sm">{cert.issuer}</p>
                  <p className="text-gray-600 text-sm">{formatDate(cert.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveEliteTemplate;
