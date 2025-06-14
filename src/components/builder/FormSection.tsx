import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Heart,
  FolderOpen,
  Users
} from 'lucide-react';

// Import all form components
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ExperienceFormEnhanced from '@/components/ExperienceFormEnhanced';
import EducationForm from '@/components/EducationForm';
import SkillsForm from '@/components/SkillsForm';
import ProjectsForm from '@/components/ProjectsForm';
import CertificationsForm from '@/components/CertificationsForm';
import LanguagesForm from '@/components/LanguagesForm';
import InterestsForm from '@/components/InterestsForm';
import ReferencesFormEnhanced from '@/components/enhanced-forms/ReferencesFormEnhanced';

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
  references: Array<{
    id: number;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

interface FormSectionProps {
  resumeData: ResumeData;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPersonalInfoChange: (data: any) => void;
  onExperienceChange: (data: any[]) => void;
  onEducationChange: (data: any[]) => void;
  onSkillsChange: (data: string[]) => void;
  onProjectsChange: (data: any[]) => void;
  onCertificationsChange: (data: any[]) => void;
  onLanguagesChange: (data: any[]) => void;
  onInterestsChange: (data: string[]) => void;
  onReferencesChange: (data: any[]) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  resumeData,
  activeTab,
  onTabChange,
  onPersonalInfoChange,
  onExperienceChange,
  onEducationChange,
  onSkillsChange,
  onProjectsChange,
  onCertificationsChange,
  onLanguagesChange,
  onInterestsChange,
  onReferencesChange
}) => {
  const handleTabChange = (newTab: string) => {
    console.log('Tab changing from', activeTab, 'to', newTab);
    setTimeout(() => {
      onTabChange(newTab);
    }, 0);
  };

  const handleFormContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const tabs = [
    { id: 'personal', label: 'Personal', shortLabel: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', shortLabel: 'Work', icon: Briefcase },
    { id: 'education', label: 'Education', shortLabel: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', shortLabel: 'Skills', icon: Award },
    { id: 'projects', label: 'Projects', shortLabel: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', shortLabel: 'Certs', icon: Award },
    { id: 'languages', label: 'Languages', shortLabel: 'Lang', icon: Languages },
    { id: 'interests', label: 'Interests', shortLabel: 'Interests', icon: Heart },
    { id: 'references', label: 'References', shortLabel: 'References', icon: Users }
  ];

  return (
    <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
      <CardContent className="relative p-3 sm:p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          
          <div className="mb-4 sm:mb-6">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <TabsList className="inline-flex h-auto bg-gray-100/70 dark:bg-gray-700/70 rounded-xl p-1 min-w-full shadow-inner">
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 w-full">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-lg rounded-lg transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-600/90 cursor-pointer min-w-0 group"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleTabChange(tab.id);
                        }}
                      >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-600 dark:text-gray-300 group-data-[state=active]:text-blue-600 dark:group-data-[state=active]:text-blue-400 transition-colors" />
                        <span className="text-xs leading-none font-medium truncate text-gray-700 dark:text-gray-300 group-data-[state=active]:text-blue-700 dark:group-data-[state=active]:text-blue-300">
                          {window.innerWidth < 640 ? tab.shortLabel : tab.label}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </div>
              </TabsList>
            </div>
          </div>

          <div className="min-h-[400px] bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6">
            <TabsContent value="personal" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <PersonalInfoForm 
                  data={resumeData.personal} 
                  onChange={onPersonalInfoChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <ExperienceFormEnhanced 
                  data={resumeData.experience} 
                  onChange={onExperienceChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <EducationForm 
                  data={resumeData.education} 
                  onChange={onEducationChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <SkillsForm 
                  data={resumeData.skills} 
                  onChange={onSkillsChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <ProjectsForm 
                  data={resumeData.projects} 
                  onChange={onProjectsChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <CertificationsForm 
                  data={resumeData.certifications} 
                  onChange={onCertificationsChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="languages" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <LanguagesForm 
                  data={resumeData.languages} 
                  onChange={onLanguagesChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="interests" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <InterestsForm 
                  data={resumeData.interests} 
                  onChange={onInterestsChange} 
                />
              </div>
            </TabsContent>

            <TabsContent value="references" className="mt-0">
              <div onClick={handleFormContainerClick}>
                <ReferencesFormEnhanced 
                  data={resumeData.references} 
                  onChange={onReferencesChange} 
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormSection;
