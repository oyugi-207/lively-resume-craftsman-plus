import React from 'react';

interface ImprovedResumePreviewProps {
  data: {
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
      achievements?: string[];
    }>;
    education: Array<{
      id: number;
      school: string;
      degree: string;
      location: string;
      startDate: string;
      endDate: string;
      gpa?: string;
    }>;
    skills: string[];
    certifications: Array<{
      id: number;
      name: string;
      issuer: string;
      date: string;
      credentialId?: string;
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
      link?: string;
      startDate?: string;
      endDate?: string;
    }>;
  };
  template: number;
  scale?: number;
}

const ImprovedResumePreview: React.FC<ImprovedResumePreviewProps> = ({ data, template, scale = 1 }) => {
  const renderModernTemplate = () => (
    <div className="bg-white text-gray-900 font-sans leading-relaxed" style={{ minHeight: '11in', width: '8.5in', fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header Section */}
      <div className="text-center py-8 px-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <h1 className="text-3xl font-bold mb-3 tracking-wide">{data.personal.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          <span>{data.personal.email}</span>
          <span>•</span>
          <span>{data.personal.phone}</span>
          <span>•</span>
          <span>{data.personal.location}</span>
        </div>
        {(data.personal.linkedin || data.personal.github || data.personal.website) && (
          <div className="flex flex-wrap justify-center items-center gap-4 mt-2 text-sm opacity-90">
            {data.personal.linkedin && <span>LinkedIn: {data.personal.linkedin}</span>}
            {data.personal.github && <span>GitHub: {data.personal.github}</span>}
            {data.personal.website && <span>Website: {data.personal.website}</span>}
          </div>
        )}
      </div>

      <div className="px-8 py-6">
        {/* Professional Summary */}
        {data.personal.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200 uppercase tracking-wide">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                      <p className="text-blue-700 font-semibold">{exp.company}</p>
                      <p className="text-gray-600 text-sm">{exp.location}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700">{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200 uppercase tracking-wide">
              Key Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-blue-700 text-sm font-medium">{project.technologies}</p>
                      {project.link && (
                        <p className="text-blue-600 text-sm break-all">{project.link}</p>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div className="text-right text-sm text-gray-600 font-medium">
                        {project.startDate} - {project.endDate}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-700 font-semibold">{edu.school}</p>
                      <p className="text-gray-600 text-sm">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200 uppercase tracking-wide">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200 uppercase tracking-wide">
                Certifications
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-blue-700 text-sm">{cert.issuer}</p>
                    <p className="text-gray-600 text-xs">{cert.date}</p>
                    {cert.credentialId && (
                      <p className="text-gray-500 text-xs">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200 uppercase tracking-wide">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-gray-900 font-medium text-sm">{lang.language}</span>
                    <span className="text-blue-700 text-sm">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Interests */}
        {data.interests.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200 uppercase tracking-wide">
              Interests
            </h2>
            <p className="text-gray-700">{data.interests.join(' • ')}</p>
          </section>
        )}
      </div>
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className="bg-white text-gray-900 font-serif leading-relaxed" style={{ minHeight: '11in', width: '8.5in', fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="text-center py-8 px-8 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-3 tracking-wider">{data.personal.fullName.toUpperCase()}</h1>
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-90">
          <span>{data.personal.email}</span>
          <span>|</span>
          <span>{data.personal.phone}</span>
          <span>|</span>
          <span>{data.personal.location}</span>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Executive Summary */}
        {data.personal.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-800 uppercase tracking-widest">
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed italic text-base">{data.personal.summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-800 uppercase tracking-widest">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                      <p className="text-gray-800 font-semibold text-base">{exp.company}, {exp.location}</p>
                    </div>
                    <div className="text-right text-gray-700 font-semibold">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed ml-4">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rest of the sections with similar styling... */}
        {/* Key Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-800 uppercase tracking-widest">
              Key Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-gray-800 text-sm font-medium">{project.technologies}</p>
                      {project.link && (
                        <p className="text-blue-600 text-sm break-all">{project.link}</p>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div className="text-right text-sm text-gray-700 font-medium">
                        {project.startDate} - {project.endDate}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-800 uppercase tracking-widest">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-800 font-semibold">{edu.school}</p>
                      <p className="text-gray-700 text-sm">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-700 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-700 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-800 uppercase tracking-widest">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-900 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-800 uppercase tracking-widest">
                Certifications
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-gray-800 text-sm">{cert.issuer}</p>
                    <p className="text-gray-700 text-xs">{cert.date}</p>
                    {cert.credentialId && (
                      <p className="text-gray-600 text-xs">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-800 uppercase tracking-widest">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-gray-900 font-medium text-sm">{lang.language}</span>
                    <span className="text-gray-800 text-sm">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Interests */}
        {data.interests.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-800 uppercase tracking-widest">
              Interests
            </h2>
            <p className="text-gray-700">{data.interests.join(' • ')}</p>
          </section>
        )}
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900 font-sans leading-relaxed" style={{ minHeight: '11in', width: '8.5in', fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="text-center py-8 px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <h1 className="text-3xl font-bold mb-3 tracking-wide">{data.personal.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          <span>{data.personal.email}</span>
          <span>•</span>
          <span>{data.personal.phone}</span>
          <span>•</span>
          <span>{data.personal.location}</span>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Professional Summary */}
        {data.personal.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-3 pb-1 border-b-2 border-purple-300 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-3 pb-1 border-b-2 border-purple-300 uppercase tracking-wide">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                      <p className="text-blue-700 font-semibold">{exp.company}</p>
                      <p className="text-gray-600 text-sm">{exp.location}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700">{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-3 pb-1 border-b-2 border-purple-300 uppercase tracking-wide">
              Key Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-blue-700 text-sm font-medium">{project.technologies}</p>
                      {project.link && (
                        <p className="text-blue-600 text-sm break-all">{project.link}</p>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div className="text-right text-sm text-gray-600 font-medium">
                        {project.startDate} - {project.endDate}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-3 pb-1 border-b-2 border-purple-300 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-700 font-semibold">{edu.school}</p>
                      <p className="text-gray-600 text-sm">{edu.location}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-gray-600 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-3 pb-1 border-b-2 border-purple-300 uppercase tracking-wide">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-purple-700 mb-3 pb-1 border-b border-purple-300 uppercase tracking-wide">
                Certifications
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-blue-700 text-sm">{cert.issuer}</p>
                    <p className="text-gray-600 text-xs">{cert.date}</p>
                    {cert.credentialId && (
                      <p className="text-gray-600 text-xs">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-purple-700 mb-3 pb-1 border-b border-purple-300 uppercase tracking-wide">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-gray-900 font-medium text-sm">{lang.language}</span>
                    <span className="text-blue-700 text-sm">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Interests */}
        {data.interests.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-purple-700 mb-3 pb-1 border-b border-purple-300 uppercase tracking-wide">
              Interests
            </h2>
            <p className="text-gray-700">{data.interests.join(' • ')}</p>
          </section>
        )}
      </div>
    </div>
  );

  const getTemplateComponent = () => {
    switch (template) {
      case 0: return renderModernTemplate();
      case 1: return renderExecutiveTemplate();
      case 2: return renderCreativeTemplate();
      default: return renderModernTemplate();
    }
  };

  return (
    <div 
      className="shadow-lg rounded-lg overflow-hidden bg-white"
      style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'top left',
        width: scale === 1 ? '8.5in' : 'auto',
        height: scale === 1 ? '11in' : 'auto'
      }}
    >
      {getTemplateComponent()}
    </div>
  );
};

export default ImprovedResumePreview;
