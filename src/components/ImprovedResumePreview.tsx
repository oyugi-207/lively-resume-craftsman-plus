import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code
} from 'lucide-react';

interface ResumeData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
  };
  experience?: {
    position: string;
    company: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
  }[];
  education?: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    location?: string;
    description?: string;
  }[];
  skills?: string[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    date?: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
  }[];
  languages?: {
    name: string;
    proficiency: string;
  }[];
}

interface ImprovedResumePreviewProps {
  resumeData: ResumeData;
  template?: number;
  scale?: number;
  className?: string;
}

const ImprovedResumePreview: React.FC<ImprovedResumePreviewProps> = ({ 
  resumeData, 
  template = 0, 
  scale = 1,
  className = ''
}) => {
  const renderTemplate = () => {
    const baseClasses = "bg-white text-black shadow-lg mx-auto";
    
    // Make preview larger - increased from max-w-2xl to max-w-4xl
    const containerClasses = `${baseClasses} max-w-4xl min-h-[1400px] p-12 ${className}`;
    
    const { personalInfo, experience, education, skills, projects, certifications, languages } = resumeData;

    switch (template) {
      case 0:
        return (
          <div className={containerClasses} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            {/* Professional Template - Enhanced for larger size */}
            <div className="space-y-8">
              {/* Header - Larger and more prominent */}
              <div className="text-center border-b-4 border-blue-600 pb-6">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                  {personalInfo?.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap justify-center gap-6 text-lg text-gray-600">
                  {personalInfo?.email && (
                    <span className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      {personalInfo.email}
                    </span>
                  )}
                  {personalInfo?.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      {personalInfo.phone}
                    </span>
                  )}
                  {personalInfo?.location && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {personalInfo.location}
                    </span>
                  )}
                  {personalInfo?.website && (
                    <span className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {personalInfo.website}
                    </span>
                  )}
                </div>
              </div>

              {/* Professional Summary - Larger text */}
              {personalInfo?.summary && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Experience - Enhanced with better formatting */}
              {experience && experience.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    PROFESSIONAL EXPERIENCE
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                            <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base text-gray-600 font-medium">
                              {exp.startDate} - {exp.endDate || 'Present'}
                            </p>
                            {exp.location && (
                              <p className="text-base text-gray-500">{exp.location}</p>
                            )}
                          </div>
                        </div>
                        {exp.description && (
                          <div className="text-base text-gray-700 leading-relaxed">
                            {exp.description.split('\n').map((line, i) => {
                              const trimmedLine = line.trim();
                              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                                return (
                                  <div key={i} className="flex items-start gap-2 mb-1">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{trimmedLine.replace(/^[•-]\s*/, '')}</span>
                                  </div>
                                );
                              }
                              return trimmedLine ? <p key={i} className="mb-2">{line}</p> : null;
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education - Larger formatting */}
              {education && education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    EDUCATION
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                            <p className="text-base text-blue-600 font-medium">{edu.school}</p>
                            {edu.description && (
                              <p className="text-base text-gray-700 mt-2">{edu.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-base text-gray-600 font-medium">
                              {edu.startDate} - {edu.endDate}
                            </p>
                            {edu.location && (
                              <p className="text-base text-gray-500">{edu.location}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills - Larger grid */}
              {skills && skills.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-600" />
                    TECHNICAL SKILLS
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="bg-blue-50 px-4 py-3 rounded-lg text-center">
                        <span className="text-base font-medium text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects - Enhanced formatting */}
              {projects && projects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6 text-blue-600" />
                    PROJECTS
                  </h2>
                  <div className="space-y-6">
                    {projects.map((project, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                            {project.url && (
                              <a href={project.url} className="text-base text-blue-600 hover:underline">
                                {project.url}
                              </a>
                            )}
                          </div>
                          {project.date && (
                            <p className="text-base text-gray-600 font-medium">{project.date}</p>
                          )}
                        </div>
                        {project.description && (
                          <div className="text-base text-gray-700 leading-relaxed">
                            {project.description.split('\n').map((line, i) => {
                              const trimmedLine = line.trim();
                              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                                return (
                                  <div key={i} className="flex items-start gap-2 mb-1">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{trimmedLine.replace(/^[•-]\s*/, '')}</span>
                                  </div>
                                );
                              }
                              return trimmedLine ? <p key={i} className="mb-2">{line}</p> : null;
                            })}
                          </div>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-600 mb-2">Technologies:</p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, i) => (
                                <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional sections with larger formatting */}
              {certifications && certifications.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-600" />
                    CERTIFICATIONS
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{cert.name}</h3>
                            <p className="text-base text-blue-600">{cert.issuer}</p>
                          </div>
                          <p className="text-base text-gray-600 font-medium">{cert.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {languages && languages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    LANGUAGES
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-base font-medium text-gray-900">{lang.name}</span>
                        <span className="text-base text-gray-600">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      // Template 1
      case 1:
        return (
          <div className={containerClasses} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            {/* Modern Template - Enhanced for larger size */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column - Personal Info */}
              <div className="col-span-1 bg-gray-100 p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {personalInfo?.fullName || 'Your Name'}
                    </h1>
                    <p className="text-lg text-gray-700">{personalInfo?.summary}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact</h3>
                    {personalInfo?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">{personalInfo.email}</span>
                      </div>
                    )}
                    {personalInfo?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">{personalInfo.phone}</span>
                      </div>
                    )}
                    {personalInfo?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">{personalInfo.location}</span>
                      </div>
                    )}
                    {personalInfo?.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800">{personalInfo.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills Section */}
                  {skills && skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Skills</h3>
                      <ul className="list-none space-y-1">
                        {skills.map((skill, index) => (
                          <li key={index} className="text-gray-800">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Languages Section */}
                  {languages && languages.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Languages</h3>
                      <ul className="list-none space-y-1">
                        {languages.map((lang, index) => (
                          <li key={index} className="text-gray-800">
                            {lang.name} - {lang.proficiency}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Experience and Education */}
              <div className="col-span-2 p-6">
                {/* Experience Section */}
                {experience && experience.length > 0 && (
                  <div className="space-y-6 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience</h2>
                    {experience.map((exp, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                            <p className="text-gray-700">{exp.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
                            {exp.location && <p className="text-gray-600">{exp.location}</p>}
                          </div>
                        </div>
                        {exp.description && (
                          <div className="text-gray-800 leading-relaxed">
                            {exp.description.split('\n').map((line, i) => {
                              const trimmedLine = line.trim();
                              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                                return (
                                  <div key={i} className="flex items-start gap-2 mb-1">
                                    <span className="text-gray-600 mt-1">•</span>
                                    <span>{trimmedLine.replace(/^[•-]\s*/, '')}</span>
                                  </div>
                                );
                              }
                              return trimmedLine ? <p key={i} className="mb-2">{line}</p> : null;
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education Section */}
                {education && education.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Education</h2>
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                            <p className="text-gray-700">{edu.school}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
                            {edu.location && <p className="text-gray-600">{edu.location}</p>}
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-gray-800 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Section */}
                {projects && projects.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Projects</h2>
                    {projects.map((project, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                            {project.url && (
                              <a href={project.url} className="text-blue-600 hover:underline">
                                {project.url}
                              </a>
                            )}
                          </div>
                          {project.date && (
                            <p className="text-gray-600">{project.date}</p>
                          )}
                        </div>
                        {project.description && (
                          <div className="text-gray-800 leading-relaxed">
                            {project.description.split('\n').map((line, i) => {
                              const trimmedLine = line.trim();
                              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                                return (
                                  <div key={i} className="flex items-start gap-2 mb-1">
                                    <span className="text-gray-600 mt-1">•</span>
                                    <span>{trimmedLine.replace(/^[•-]\s*/, '')}</span>
                                  </div>
                                );
                              }
                              return trimmedLine ? <p key={i} className="mb-2">{line}</p> : null;
                            })}
                          </div>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-600 mb-2">Technologies:</p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, i) => (
                                <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={containerClasses} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            {/* Default larger template */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-center">Default Resume Template</h1>
              <p className="text-gray-600 text-center">Please select a different template to see your resume.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="resume-preview">
      {renderTemplate()}
    </div>
  );
};

export default ImprovedResumePreview;
