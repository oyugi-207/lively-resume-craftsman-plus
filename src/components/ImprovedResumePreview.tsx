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
  const getTemplateStyles = (template: number) => {
    switch (template) {
      case 0: // Modern Professional
        return {
          container: 'font-sans text-gray-800 bg-white shadow-lg rounded-lg overflow-hidden',
          header: 'bg-blue-600 text-white py-4 px-6',
          section: 'px-6 py-4 border-b border-gray-200',
          sectionTitle: 'text-xl font-semibold mb-2 text-blue-600',
          itemTitle: 'font-semibold',
          itemSubtitle: 'text-gray-600',
          skillBadge: 'inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 1: // Executive Leadership
        return {
          container: 'font-serif text-gray-900 bg-gray-100 shadow-xl rounded-xl overflow-hidden',
          header: 'bg-black text-white py-6 px-8',
          section: 'px-8 py-6 border-b border-gray-300',
          sectionTitle: 'text-2xl font-bold mb-3 text-gray-800',
          itemTitle: 'font-bold',
          itemSubtitle: 'text-gray-700 italic',
          skillBadge: 'inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2',
        };
      case 2: // Classic Corporate
        return {
          container: 'font-serif text-gray-700 bg-white shadow-md rounded-md overflow-hidden',
          header: 'bg-gray-200 py-3 px-5',
          section: 'px-5 py-3 border-b border-gray-300',
          sectionTitle: 'text-lg font-bold mb-2 text-gray-700',
          itemTitle: 'font-semibold',
          itemSubtitle: 'text-gray-500',
          skillBadge: 'inline-block bg-gray-300 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1',
        };
      case 3: // Creative Designer
        return {
          container: 'font-sans text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg rounded-xl overflow-hidden',
          header: 'bg-white/20 backdrop-blur-sm py-5 px-7',
          section: 'px-7 py-5 border-b border-white/30',
          sectionTitle: 'text-xl font-bold mb-3 text-white',
          itemTitle: 'font-bold',
          itemSubtitle: 'text-gray-200 italic',
          skillBadge: 'inline-block bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 4: // Tech Specialist
        return {
          container: 'font-mono text-green-800 bg-gray-900 shadow-xl rounded-xl overflow-hidden border-2 border-green-500',
          header: 'bg-green-500 text-white py-4 px-6',
          section: 'px-6 py-4 border-b border-gray-700',
          sectionTitle: 'text-xl font-semibold mb-2 text-green-500',
          itemTitle: 'font-semibold text-green-400',
          itemSubtitle: 'text-gray-500',
          skillBadge: 'inline-block bg-green-200 text-green-900 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 5: // Minimalist
        return {
          container: 'font-sans text-gray-700 bg-white shadow-sm rounded-md overflow-hidden border border-gray-200',
          header: 'bg-gray-100 py-2 px-4',
          section: 'px-4 py-2 border-b border-gray-200',
          sectionTitle: 'text-lg font-semibold mb-1 text-gray-700',
          itemTitle: 'font-medium',
          itemSubtitle: 'text-gray-500',
          skillBadge: 'inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1',
        };
      case 6: // Two Column
        return {
          container: 'font-sans text-gray-800 bg-white shadow-lg rounded-lg overflow-hidden flex',
          header: 'bg-blue-700 text-white py-4 px-6',
          section: 'px-6 py-4 border-b border-gray-200',
          sectionTitle: 'text-xl font-semibold mb-2 text-blue-700',
          itemTitle: 'font-semibold',
          itemSubtitle: 'text-gray-600',
          skillBadge: 'inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 7: // Academic Scholar
        return {
          container: 'font-serif text-gray-800 bg-white shadow-md rounded-lg overflow-hidden',
          header: 'bg-blue-800 text-white py-5 px-7',
          section: 'px-7 py-5 border-b border-gray-300',
          sectionTitle: 'text-xl font-semibold mb-3 text-blue-800',
          itemTitle: 'font-semibold italic',
          itemSubtitle: 'text-gray-600',
          skillBadge: 'inline-block bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 8: // Sales Champion
        return {
          container: 'font-sans text-white bg-red-600 shadow-xl rounded-xl overflow-hidden',
          header: 'bg-red-700 py-4 px-6',
          section: 'px-6 py-4 border-b border-red-400',
          sectionTitle: 'text-xl font-bold mb-2 text-yellow-300',
          itemTitle: 'font-bold',
          itemSubtitle: 'text-yellow-100 italic',
          skillBadge: 'inline-block bg-yellow-200 text-red-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 9: // Startup Innovator
        return {
          container: 'font-sans text-gray-900 bg-yellow-50 shadow-lg rounded-lg overflow-hidden',
          header: 'bg-yellow-400 text-gray-900 py-4 px-6',
          section: 'px-6 py-4 border-b border-gray-200',
          sectionTitle: 'text-xl font-semibold mb-2 text-yellow-600',
          itemTitle: 'font-semibold',
          itemSubtitle: 'text-gray-600',
          skillBadge: 'inline-block bg-yellow-100 text-yellow-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 10: // Healthcare Professional
        return {
          container: 'font-serif text-gray-800 bg-green-50 shadow-md rounded-lg overflow-hidden',
          header: 'bg-green-400 text-white py-5 px-7',
          section: 'px-7 py-5 border-b border-gray-300',
          sectionTitle: 'text-xl font-semibold mb-3 text-green-600',
          itemTitle: 'font-semibold italic',
          itemSubtitle: 'text-gray-600',
          skillBadge: 'inline-block bg-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 11: // Finance Expert
        return {
          container: 'font-mono text-blue-900 bg-gray-100 shadow-xl rounded-xl overflow-hidden border-2 border-blue-700',
          header: 'bg-blue-700 text-white py-4 px-6',
          section: 'px-6 py-4 border-b border-gray-300',
          sectionTitle: 'text-xl font-semibold mb-2 text-blue-700',
          itemTitle: 'font-semibold text-blue-600',
          itemSubtitle: 'text-gray-500',
          skillBadge: 'inline-block bg-blue-200 text-blue-900 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 12: // Marketing Creative
        return {
          container: 'font-sans text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg rounded-xl overflow-hidden',
          header: 'bg-white/20 backdrop-blur-sm py-5 px-7',
          section: 'px-7 py-5 border-b border-white/30',
          sectionTitle: 'text-xl font-bold mb-3 text-white',
          itemTitle: 'font-bold',
          itemSubtitle: 'text-gray-200 italic',
          skillBadge: 'inline-block bg-pink-200 text-pink-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
      case 13: // Engineering Focus
        return {
          container: 'font-mono text-gray-800 bg-gray-100 shadow-md rounded-md overflow-hidden',
          header: 'bg-gray-200 py-3 px-5',
          section: 'px-5 py-3 border-b border-gray-300',
          sectionTitle: 'text-lg font-bold mb-2 text-gray-800',
          itemTitle: 'font-semibold',
          itemSubtitle: 'text-gray-500',
          skillBadge: 'inline-block bg-gray-300 text-gray-800 rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1',
        };
      case 14: // Legal Professional
        return {
          container: 'font-serif text-gray-900 bg-white shadow-xl rounded-xl overflow-hidden',
          header: 'bg-blue-900 text-white py-6 px-8',
          section: 'px-8 py-6 border-b border-gray-300',
          sectionTitle: 'text-2xl font-bold mb-3 text-blue-900',
          itemTitle: 'font-bold italic',
          itemSubtitle: 'text-gray-700',
          skillBadge: 'inline-block bg-blue-100 text-blue-900 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2',
        };
      case 15: // Consulting Elite
        return {
          container: 'font-sans text-gray-700 bg-white shadow-sm rounded-md overflow-hidden border border-gray-200',
          header: 'bg-gray-100 py-2 px-4',
          section: 'px-4 py-2 border-b border-gray-200',
          sectionTitle: 'text-lg font-semibold mb-1 text-gray-700',
          itemTitle: 'font-medium',
          itemSubtitle: 'text-gray-500',
          skillBadge: 'inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1',
        };
      default:
        return {
          container: 'font-sans text-gray-800 bg-white shadow-lg rounded-lg overflow-hidden',
          header: 'bg-blue-600 text-white py-4 px-6',
          section: 'px-6 py-4 border-b border-gray-200',
          sectionTitle: 'text-xl font-semibold mb-2 text-blue-600',
          itemTitle: 'font-semibold',
          itemSubtitle: 'text-gray-600',
          skillBadge: 'inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2',
        };
    }
  };

  const styles = getTemplateStyles(template);

  return (
    <div className={styles.container} style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '8.5in' }}>
      <div className={styles.header}>
        <h1 className="text-3xl font-bold">{data.personal.fullName}</h1>
        <p className="text-md">{data.personal.summary}</p>
        <div className="mt-2">
          <p>{data.personal.email} | {data.personal.phone} | {data.personal.location}</p>
          {data.personal.website && <p>Website: {data.personal.website}</p>}
          {data.personal.linkedin && <p>LinkedIn: {data.personal.linkedin}</p>}
          {data.personal.github && <p>GitHub: {data.personal.github}</p>}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <h3 className={styles.itemTitle}>{exp.position}, {exp.company}</h3>
            <p className={styles.itemSubtitle}>{exp.location}, {exp.startDate} - {exp.endDate}</p>
            <p>{exp.description}</p>
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="list-disc pl-5">
                {exp.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-3">
            <h3 className={styles.itemTitle}>{edu.degree}, {edu.school}</h3>
            <p className={styles.itemSubtitle}>{edu.location}, {edu.startDate} - {edu.endDate}</p>
            {edu.gpa && <p>GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        {data.skills.map((skill, index) => (
          <span key={index} className={styles.skillBadge}>{skill}</span>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Certifications</h2>
        {data.certifications.map((cert) => (
          <div key={cert.id} className="mb-3">
            <h3 className={styles.itemTitle}>{cert.name}</h3>
            <p className={styles.itemSubtitle}>{cert.issuer}, {cert.date}</p>
            {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Languages</h2>
        {data.languages.map((lang) => (
          <div key={lang.id} className="mb-3">
            <h3 className={styles.itemTitle}>{lang.language}</h3>
            <p className={styles.itemSubtitle}>Proficiency: {lang.proficiency}</p>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Interests</h2>
        <p>{data.interests.join(', ')}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        {data.projects.map((project) => (
          <div key={project.id} className="mb-3">
            <h3 className={styles.itemTitle}>{project.name}</h3>
            <p className={styles.itemSubtitle}>{project.technologies}</p>
            <p>{project.description}</p>
            {project.link && <a href={project.link} className="text-blue-500 underline">View Project</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovedResumePreview;
