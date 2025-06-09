
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, ExternalLink, Award, Globe, Linkedin, Github } from 'lucide-react';

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
  jobDescription?: string; // Hidden ATS keywords
}

interface ResumeTemplateProps {
  data: ResumeData;
  templateId: number;
}

// Template 0: Modern Professional (Resume.io inspired)
export const ModernProfessionalTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Header Section */}
    <div className="bg-slate-800 text-white p-8">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{data.personal.fullName || 'Your Name'}</h1>
          <p className="text-slate-300 text-lg mb-4">Professional Summary</p>
          {data.personal.summary && (
            <p className="text-slate-200 leading-relaxed max-w-2xl">{data.personal.summary}</p>
          )}
        </div>
        
        <div className="ml-8 text-right space-y-2">
          {data.personal.email && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{data.personal.location}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div className="flex items-center justify-end gap-2 text-slate-300">
              <Linkedin className="w-4 h-4" />
              <span className="text-sm">LinkedIn</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="p-8 space-y-8">
      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-slate-300 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{exp.position}</h3>
                    <p className="text-slate-600 font-medium">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-slate-100 text-slate-800 border-slate-300 px-4 py-2">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-2">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.school} • {edu.location}</p>
                </div>
                <span className="text-slate-500 text-sm">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 1: Executive Leadership
export const ExecutiveTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-serif max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Elegant Header */}
    <div className="border-b-4 border-amber-600 pb-8 mb-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">{data.personal.fullName || 'Your Name'}</h1>
        <div className="w-32 h-1 bg-amber-600 mx-auto mb-4"></div>
        <div className="flex justify-center gap-8 text-gray-600">
          {data.personal.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{data.personal.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-8">
      {/* Executive Summary */}
      {data.personal.summary && (
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto text-lg">{data.personal.summary}</p>
        </section>
      )}

      {/* Leadership Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Leadership Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-amber-700 font-semibold text-lg">{exp.company}</p>
                    <p className="text-gray-600">{exp.location}</p>
                  </div>
                  <span className="text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 2: Creative Designer
export const CreativeTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 font-sans max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Creative Header */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="relative text-white p-12">
        <h1 className="text-5xl font-bold mb-4">{data.personal.fullName || 'Your Name'}</h1>
        <p className="text-purple-100 text-xl mb-6">Creative Professional</p>
        
        <div className="flex gap-6">
          {data.personal.email && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              {data.personal.email}
            </div>
          )}
          {data.personal.phone && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              {data.personal.phone}
            </div>
          )}
          {data.personal.location && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              {data.personal.location}
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="p-8 space-y-8">
      {/* Creative Vision */}
      {data.personal.summary && (
        <section>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Vision
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-gray-700 leading-relaxed text-lg">{data.personal.summary}</p>
          </div>
        </section>
      )}

      {/* Portfolio & Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Journey
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-400">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-purple-800">{exp.position}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-purple-700">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Creative Skills */}
      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Arsenal
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium shadow-lg">
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

// Template 3: Tech Specialist
export const TechTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-gray-900 text-green-400 font-mono max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Terminal Header */}
    <div className="bg-black border border-green-400 rounded-t-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-green-300 text-sm">terminal — bash — 80x24</span>
      </div>
      
      <div className="space-y-2">
        <div className="text-green-300">$ whoami</div>
        <h1 className="text-3xl font-bold text-green-400">{data.personal.fullName || 'Your Name'}</h1>
        <div className="text-green-300">$ cat role.txt</div>
        <div className="text-green-400">Software Engineer & Tech Specialist</div>
        
        <div className="mt-4 space-y-1">
          {data.personal.email && (
            <div className="text-green-400">email: <span className="text-green-300">{data.personal.email}</span></div>
          )}
          {data.personal.phone && (
            <div className="text-green-400">phone: <span className="text-green-300">{data.personal.phone}</span></div>
          )}
          {data.personal.location && (
            <div className="text-green-400">location: <span className="text-green-300">{data.personal.location}</span></div>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-6">
      {/* Summary */}
      {data.personal.summary && (
        <div className="bg-gray-800 border border-green-400 rounded p-6">
          <div className="text-green-300 mb-3">$ cat summary.md</div>
          <p className="text-green-100 leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="bg-gray-800 border border-green-400 rounded p-6">
          <div className="text-green-300 mb-4">$ ls -la experience/</div>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-4 border-green-400 pl-4">
                <div className="text-green-300 text-sm">drwxr-xr-x {exp.startDate}-{exp.endDate}</div>
                <div className="text-green-400 font-bold">{exp.position}</div>
                <div className="text-green-300">{exp.company} @ {exp.location}</div>
                <div className="text-green-100 mt-2">{exp.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {data.skills?.length > 0 && (
        <div className="bg-gray-800 border border-green-400 rounded p-6">
          <div className="text-green-300 mb-3">$ cat tech_stack.json</div>
          <div className="text-green-400">
            <div>&#123;</div>
            <div className="ml-4">"technologies": [</div>
            {data.skills.map((skill, index) => (
              <div key={index} className="ml-8 text-green-100">
                "{skill}"{index < data.skills.length - 1 ? ',' : ''}
              </div>
            ))}
            <div className="ml-4">]</div>
            <div>&#125;</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Template 4: Minimalist Clean
export const MinimalistTemplate: React.FC<ResumeTemplateProps> = ({ data }) => (
  <div className="bg-white text-gray-900 font-light max-w-4xl mx-auto">
    {/* Hidden ATS Keywords */}
    {data.jobDescription && (
      <div className="hidden opacity-0 absolute -z-10 text-white text-xs">
        {data.jobDescription}
      </div>
    )}
    
    {/* Clean Header */}
    <div className="border-b border-gray-200 pb-12 mb-12">
      <h1 className="text-6xl font-thin text-gray-900 mb-6 tracking-wide">
        {data.personal.fullName || 'Your Name'}
      </h1>
      
      <div className="flex justify-between items-start">
        <div className="text-gray-600 space-y-2">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
        </div>
        
        {data.personal.summary && (
          <div className="max-w-lg">
            <p className="text-gray-700 leading-loose text-lg">{data.personal.summary}</p>
          </div>
        )}
      </div>
    </div>

    <div className="space-y-12">
      {/* Experience */}
      {data.experience?.length > 0 && (
        <section>
          <h2 className="text-3xl font-thin text-gray-900 mb-8 tracking-wide">Experience</h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-100 pb-6">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-normal text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-sm">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-gray-600 mb-4 text-lg">{exp.company}, {exp.location}</div>
                <p className="text-gray-700 leading-loose">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-2 gap-12">
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-3xl font-thin text-gray-900 mb-6 tracking-wide">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-gray-700 py-2 border-b border-gray-100">
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-3xl font-thin text-gray-900 mb-6 tracking-wide">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-normal text-gray-900 text-lg">{edu.degree}</h3>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-gray-500 text-sm">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// Export all templates
export const templates = [
  ModernProfessionalTemplate,
  ExecutiveTemplate,
  CreativeTemplate,
  TechTemplate,
  MinimalistTemplate,
  // Add more templates here...
];

export const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',
    'Executive Leadership', 
    'Creative Designer',
    'Tech Specialist',
    'Minimalist Clean',
    'Corporate Classic',
    'Two Column Layout',
    'Academic Scholar',
    'Sales Champion',
    'Startup Innovator',
    'Healthcare Professional',
    'Finance Expert',
    'Marketing Creative',
    'Engineering Focus',
    'Legal Professional',
    'Consulting Elite'
  ];
  return names[index] || 'Modern Professional';
};
