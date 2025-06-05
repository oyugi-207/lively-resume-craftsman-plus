
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Globe, Award, Calendar, ExternalLink } from 'lucide-react';

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
    honors?: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    expiryDate?: string;
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
    startDate: string;
    endDate: string;
    highlights?: string[];
  }>;
}

interface ImprovedResumePreviewProps {
  data: ResumeData;
  template: number;
  scale?: number;
}

const ImprovedResumePreview: React.FC<ImprovedResumePreviewProps> = ({ 
  data, 
  template, 
  scale = 0.8 
}) => {
  const renderTemplate = () => {
    switch (template) {
      case 0: return <ModernProfessionalTemplate data={data} />;
      case 1: return <ExecutiveTemplate data={data} />;
      case 2: return <ClassicTemplate data={data} />;
      case 3: return <CreativeTemplate data={data} />;
      case 4: return <TechTemplate data={data} />;
      case 5: return <MinimalistTemplate data={data} />;
      case 6: return <TwoColumnTemplate data={data} />;
      default: return <ModernProfessionalTemplate data={data} />;
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <div className="w-full h-full bg-white" style={{ aspectRatio: '8.5/11', minHeight: '1100px' }}>
        <div className="h-full p-8 text-sm overflow-y-auto">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

const ModernProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="text-center pb-6 border-b-2 border-blue-600">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{data.personal.fullName}</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4" />
          <span>{data.personal.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          <span>{data.personal.phone}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{data.personal.location}</span>
        </div>
        {data.personal.website && (
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span>{data.personal.website}</span>
          </div>
        )}
      </div>
    </div>

    {/* Professional Summary */}
    {data.personal.summary && (
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
          Professional Experience
        </h2>
        <div className="space-y-5">
          {data.experience.map((exp) => (
            <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company} • {exp.location}</p>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed mb-2">{exp.description}</p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
          Key Projects
        </h2>
        <div className="space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                  <p className="text-blue-600 text-sm">{project.technologies}</p>
                  {project.link && (
                    <div className="flex items-center gap-1 text-blue-600 text-sm">
                      <ExternalLink className="w-3 h-3" />
                      <span>{project.link}</span>
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="text-gray-600 text-xs">
                  {project.startDate} - {project.endDate}
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600 font-medium">{edu.school} • {edu.location}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                {edu.honors && <p className="text-gray-600 italic">{edu.honors}</p>}
              </div>
              <Badge variant="outline" className="text-gray-600">
                {edu.startDate} - {edu.endDate}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
          Core Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {/* Additional Sections */}
    <div className="grid grid-cols-2 gap-6">
      {/* Languages */}
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Languages
          </h2>
          <div className="space-y-2">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-700 font-medium">{lang.language}</span>
                <Badge variant="outline" className="text-xs">{lang.proficiency}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                <p className="text-blue-600 text-sm">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Interests */}
    {data.interests.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">
          Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.interests.map((interest) => (
            <Badge key={interest} variant="outline" className="text-gray-700">
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-6">
    {/* Executive Header */}
    <div className="text-center pb-6 border-b-4 border-gray-800">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 uppercase tracking-wider">
        {data.personal.fullName}
      </h1>
      <div className="flex items-center justify-center gap-6 text-gray-600 text-lg">
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        <span>•</span>
        <span>{data.personal.location}</span>
      </div>
    </div>

    {/* Executive Summary */}
    {data.personal.summary && (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Executive Summary
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg italic">{data.personal.summary}</p>
      </div>
    )}

    {/* Core Competencies */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Core Competencies
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {data.skills.map((skill) => (
            <div key={skill} className="text-center py-2 border border-gray-300 rounded text-gray-700 font-medium">
              {skill}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Professional Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
          Professional Experience
        </h2>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700 text-lg font-medium">{exp.company}, {exp.location}</p>
                </div>
                <span className="text-gray-600 font-bold text-lg">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg ml-4">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education & Additional Qualifications */}
    <div className="grid grid-cols-2 gap-8">
      {data.education.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                <p className="text-gray-700 font-medium">{edu.school}, {edu.location}</p>
                <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                <p className="text-gray-700">{cert.issuer} ({cert.date})</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-6">
    {/* Creative Header */}
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-3">{data.personal.fullName}</h1>
      <div className="space-y-2 text-purple-100">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{data.personal.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{data.personal.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{data.personal.location}</span>
        </div>
      </div>
    </div>

    {/* About Me */}
    {data.personal.summary && (
      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-purple-900 mb-3">About Me</h2>
        <p className="text-purple-800 leading-relaxed">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience with creative styling */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-purple-600 mb-4">Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="border-l-4 border-purple-300 pl-4 bg-purple-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-purple-600 font-medium">{exp.company} • {exp.location}</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {exp.startDate} - {exp.endDate}
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills with gradient badges */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-purple-600 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill) => (
            <Badge key={skill} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    )}

    {/* Projects in cards */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-purple-600 mb-4">Projects</h2>
        <div className="grid gap-4">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-purple-600 text-sm mb-2">{project.technologies}</p>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education and other sections */}
    <div className="grid grid-cols-2 gap-6">
      {data.education.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-purple-600 mb-3">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="bg-purple-50 p-3 rounded-lg mb-3">
              <h3 className="font-bold text-gray-900">{edu.degree}</h3>
              <p className="text-purple-600">{edu.school}</p>
              <p className="text-gray-600 text-sm">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-purple-600 mb-3">Languages</h2>
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">{lang.language}</span>
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                {lang.proficiency}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const TechTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-6 font-mono">
    {/* Tech Header */}
    <div className="bg-gray-900 text-green-400 p-6 rounded-lg">
      <div className="flex items-center mb-3">
        <span className="text-gray-500 mr-2">$</span>
        <h1 className="text-2xl font-bold">{data.personal.fullName.toLowerCase().replace(/\s+/g, '_')}</h1>
      </div>
      <div className="text-green-300 space-y-1">
        <div>email: {data.personal.email}</div>
        <div>phone: {data.personal.phone}</div>
        <div>location: {data.personal.location}</div>
      </div>
    </div>

    {/* About */}
    {data.personal.summary && (
      <div className="border border-green-300 p-4 rounded">
        <h2 className="text-lg font-bold text-green-600 mb-3">// About</h2>
        <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-green-600 mb-4">// Work Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="bg-gray-50 p-4 rounded border-l-4 border-green-400">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">
                    function {exp.position.toLowerCase().replace(/\s+/g, '_')}() {'{}'}
                  </h3>
                  <p className="text-green-600">// {exp.company} • {exp.location}</p>
                </div>
                <Badge className="bg-gray-800 text-green-400 font-mono">
                  {exp.startDate} - {exp.endDate}
                </Badge>
              </div>
              <p className="text-gray-700 leading-relaxed ml-4">// {exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Technical Skills */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-green-600 mb-4">// Technical Skills</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={skill}>
                "{skill}"{index < data.skills.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-green-600 mb-4">// Projects</h2>
        <div className="space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-gray-50 p-4 rounded border-l-4 border-blue-400">
              <h3 className="font-bold text-gray-900 mb-1">
                const {project.name.toLowerCase().replace(/\s+/g, '_')} = {'{}'}
              </h3>
              <p className="text-blue-600 text-sm">// Tech: {project.technologies}</p>
              <p className="text-gray-700 leading-relaxed mt-2">// {project.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-8">
    {/* Minimalist Header */}
    <div className="text-left">
      <h1 className="text-3xl font-light text-gray-900 mb-2">{data.personal.fullName}</h1>
      <div className="text-gray-600 space-x-4">
        <span>{data.personal.email}</span>
        <span>{data.personal.phone}</span>
        <span>{data.personal.location}</span>
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div>
        <p className="text-gray-700 leading-relaxed text-lg font-light">{data.personal.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
          Experience
        </h2>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-gray-700 leading-relaxed font-light">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
          Skills
        </h2>
        <p className="text-gray-700 font-light">{data.skills.join(' • ')}</p>
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600 font-light">{edu.school}</p>
              </div>
              <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <ModernProfessionalTemplate data={data} />
);

const TwoColumnTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="grid grid-cols-3 gap-8 h-full">
    {/* Left Column */}
    <div className="bg-gray-100 p-6 space-y-6">
      {/* Contact */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Contact</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span>{data.personal.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3" />
            <span>{data.personal.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{data.personal.location}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Skills</h2>
          <div className="space-y-1">
            {data.skills.map((skill) => (
              <div key={skill} className="text-sm text-gray-700">{skill}</div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Languages</h2>
          <div className="space-y-1">
            {data.languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="text-gray-700 font-medium">{lang.language}</span>
                <div className="text-gray-600 text-xs">{lang.proficiency}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-sm">
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-gray-500 text-xs">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Right Column */}
    <div className="col-span-2 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
        {data.personal.summary && (
          <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
        )}
      </div>

      {/* Experience */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-1">{project.technologies}</p>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ImprovedResumePreview;
