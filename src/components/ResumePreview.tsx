
import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

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
    gpa: string;
  }>;
  skills: string[];
  certifications: Array<any>;
}

interface ResumePreviewProps {
  data: ResumeData;
  template: number;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 0:
        return <ModernTemplate data={data} />;
      case 1:
        return <CreativeTemplate data={data} />;
      case 2:
        return <TechTemplate data={data} />;
      case 3:
        return <ExecutiveTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h2>
        <div className="text-sm text-gray-500">Template: {getTemplateName(template)}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
        <div className="h-full p-6 text-xs overflow-y-auto">
          {renderTemplate()}
        </div>
      </div>
    </Card>
  );
};

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="text-center border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.personal.fullName}</h1>
      <div className="flex items-center justify-center space-x-4 text-gray-600">
        <div className="flex items-center">
          <Mail className="w-3 h-3 mr-1" />
          {data.personal.email}
        </div>
        <div className="flex items-center">
          <Phone className="w-3 h-3 mr-1" />
          {data.personal.phone}
        </div>
        <div className="flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {data.personal.location}
        </div>
      </div>
    </div>

    {/* Summary */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
    </div>

    {/* Experience */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
        Professional Experience
      </h2>
      <div className="space-y-3">
        {data.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700">{exp.company} • {exp.location}</p>
              </div>
              <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Education */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
        Education
      </h2>
      <div className="space-y-2">
        {data.education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.school} • {edu.location}</p>
              {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
            </div>
            <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Skills */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill) => (
          <span key={skill} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Header with gradient */}
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">{data.personal.fullName}</h1>
      <div className="space-y-1 text-purple-100">
        <div>{data.personal.email} • {data.personal.phone}</div>
        <div>{data.personal.location}</div>
      </div>
    </div>

    {/* Summary */}
    <div className="bg-purple-50 p-3 rounded-lg">
      <h2 className="text-lg font-semibold text-purple-900 mb-2">About Me</h2>
      <p className="text-purple-800 leading-relaxed">{data.personal.summary}</p>
    </div>

    {/* Experience */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2 text-purple-600">Experience</h2>
      <div className="space-y-3">
        {data.experience.map((exp) => (
          <div key={exp.id} className="border-l-4 border-purple-300 pl-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-purple-600">{exp.company} • {exp.location}</p>
              </div>
              <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Education */}
    <div>
      <h2 className="text-lg font-semibold text-purple-600 mb-2">Education</h2>
      <div className="space-y-2">
        {data.education.map((edu) => (
          <div key={edu.id} className="bg-purple-50 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-purple-600">{edu.school} • {edu.location}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
              <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Skills */}
    <div>
      <h2 className="text-lg font-semibold text-purple-600 mb-2">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill) => (
          <span key={skill} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const TechTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4 font-mono">
    {/* Header with tech styling */}
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <span className="text-gray-500 mr-2">$</span>
        <h1 className="text-xl font-bold">{data.personal.fullName.toLowerCase().replace(' ', '_')}</h1>
      </div>
      <div className="text-green-300 text-sm space-y-1">
        <div>email: {data.personal.email}</div>
        <div>phone: {data.personal.phone}</div>
        <div>location: {data.personal.location}</div>
      </div>
    </div>

    {/* Summary */}
    <div className="border border-green-300 p-3 rounded">
      <h2 className="text-lg font-semibold text-green-600 mb-2">// Professional Summary</h2>
      <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
    </div>

    {/* Experience */}
    <div>
      <h2 className="text-lg font-semibold text-green-600 mb-2">// Work Experience</h2>
      <div className="space-y-3">
        {data.experience.map((exp) => (
          <div key={exp.id} className="bg-gray-50 p-3 rounded border-l-4 border-green-400">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-semibold text-gray-900">function {exp.position.toLowerCase().replace(/\s+/g, '_')}()</h3>
                <p className="text-green-600">{exp.company} • {exp.location}</p>
              </div>
              <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-700 leading-relaxed ml-4">// {exp.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Education */}
    <div>
      <h2 className="text-lg font-semibold text-green-600 mb-2">// Education</h2>
      <div className="space-y-2">
        {data.education.map((edu) => (
          <div key={edu.id} className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-green-600">{edu.school} • {edu.location}</p>
                {edu.gpa && <p className="text-gray-600">// GPA: {edu.gpa}</p>}
              </div>
              <span className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Skills */}
    <div>
      <h2 className="text-lg font-semibold text-green-600 mb-2">// Technical Skills</h2>
      <div className="bg-gray-900 text-green-400 p-3 rounded">
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span key={skill}>
              "{skill}"{index < data.skills.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Header with executive styling */}
    <div className="text-center border-b-2 border-gray-800 pb-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personal.fullName.toUpperCase()}</h1>
      <div className="flex items-center justify-center space-x-6 text-gray-600 text-sm">
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        <span>•</span>
        <span>{data.personal.location}</span>
      </div>
    </div>

    {/* Executive Summary */}
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Executive Summary</h2>
      <p className="text-gray-700 leading-relaxed italic">{data.personal.summary}</p>
    </div>

    {/* Professional Experience */}
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Experience</h2>
      <div className="space-y-4">
        {data.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                <p className="text-gray-700 font-medium">{exp.company}, {exp.location}</p>
              </div>
              <span className="text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-700 leading-relaxed ml-4">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Education */}
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Education</h2>
      <div className="space-y-2">
        {data.education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school}, {edu.location}</p>
                {edu.gpa && <p className="text-gray-600">Cumulative GPA: {edu.gpa}</p>}
              </div>
              <span className="text-gray-600 font-medium">{edu.startDate} - {edu.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Core Competencies */}
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">Core Competencies</h2>
      <div className="grid grid-cols-3 gap-2">
        {data.skills.map((skill) => (
          <div key={skill} className="text-gray-700 text-center py-1 border border-gray-300 rounded text-sm">
            {skill}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const getTemplateName = (index: number): string => {
  const names = ['Modern Professional', 'Creative Designer', 'Tech Specialist', 'Executive Leader'];
  return names[index] || 'Modern Professional';
};

export default ResumePreview;
