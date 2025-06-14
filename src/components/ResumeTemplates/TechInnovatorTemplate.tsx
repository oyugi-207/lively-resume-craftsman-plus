
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

interface TechInnovatorTemplateProps {
  data: ResumeData;
}

const TechInnovatorTemplate: React.FC<TechInnovatorTemplateProps> = ({ data }) => {
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
    <div className="bg-gray-900 text-white max-w-4xl mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Tech Header with Code Aesthetic */}
      <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="text-green-400/20 font-mono text-xs leading-none overflow-hidden">
            {'{ "developer": true, "innovative": true, "skills": ["coding", "problem-solving", "creativity"] }'}
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 font-mono text-sm text-gray-200">~/portfolio/resume</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 font-mono">
            <span className="text-green-400">const</span> developer = "{data.personal.fullName || 'YourName'}"
          </h1>
          <div className="font-mono text-sm text-gray-200 space-y-1">
            {data.personal.email && <p><span className="text-blue-400">email:</span> "{data.personal.email}"</p>}
            {data.personal.phone && <p><span className="text-blue-400">phone:</span> "{data.personal.phone}"</p>}
            {data.personal.location && <p><span className="text-blue-400">location:</span> "{data.personal.location}"</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {/* Left Tech Sidebar */}
        <div className="bg-gray-800 p-6 space-y-6">
          {/* Skills as Code */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-4 font-mono">
                {'<Skills />'}
              </h3>
              <div className="space-y-2">
                {data.skills.slice(0, 12).map((skill, index) => (
                  <div key={index} className="bg-gray-700 p-2 rounded border-l-2 border-green-400 font-mono text-sm">
                    <span className="text-gray-300">"{skill}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub-style Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-4 font-mono">
                languages: []
              </h3>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm">
                    <span className="font-mono text-gray-300">{lang.language}</span>
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded font-mono">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terminal-style Interests */}
          {data.interests && data.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-4 font-mono">
                $ interests --list
              </h3>
              <div className="space-y-1">
                {data.interests.map((interest, index) => (
                  <div key={index} className="text-sm font-mono text-gray-300">
                    <span className="text-green-400">></span> {interest}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 bg-gray-900 p-6 space-y-6">
          {/* Summary as Code Comment */}
          {data.personal.summary && (
            <div>
              <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">
                {'/* Summary */'}
              </h2>
              <div className="bg-gray-800 p-4 rounded border-l-4 border-green-400">
                <p className="text-gray-300 leading-relaxed font-mono text-sm">
                  {data.personal.summary}
                </p>
              </div>
            </div>
          )}

          {/* Experience as Code Functions */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-400 mb-4 font-mono">
                {'function experience() {'}
              </h2>
              <div className="space-y-4 pl-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded border-l-2 border-blue-400">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white font-mono">{exp.position}</h3>
                        <p className="text-blue-400 font-mono">{exp.company}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400 font-mono">
                        <p className="bg-gray-700 px-2 py-1 rounded">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </p>
                        {exp.location && <p className="mt-1">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono">
                        <span className="text-green-400">// </span>
                        {exp.description.split('\n').join('\n// ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-blue-400 font-mono mt-2">{'}'}</p>
            </div>
          )}

          {/* Projects as Repositories */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-purple-400 mb-4 font-mono">
                {'git log --projects'}
              </h2>
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded border-l-2 border-purple-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white font-mono">{project.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-2 font-mono">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.split(',').map((tech, techIndex) => (
                          <span key={techIndex} className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-mono">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-4 font-mono">
                {'class Education {'}
              </h2>
              <div className="space-y-3 pl-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded border-l-2 border-yellow-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white font-mono">{edu.degree}</h3>
                        <p className="text-yellow-400 font-mono">{edu.school}</p>
                        {edu.gpa && <p className="text-sm text-gray-400 font-mono">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-400 font-mono">
                        <p className="bg-gray-700 px-2 py-1 rounded">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                        {edu.location && <p className="mt-1">{edu.location}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-yellow-400 font-mono mt-2">{'}'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechInnovatorTemplate;
