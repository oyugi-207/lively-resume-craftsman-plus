
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
import ReferencesForm from '@/components/ReferencesForm';

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
    onTabChange(newTab);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 to-purple-600/3"></div>
      <CardContent className="relative p-3 sm:p-4 lg:p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          
          {/* Mobile-First Tab Navigation */}
          <TabsList className="grid grid-cols-5 sm:grid-cols-9 mb-4 sm:mb-6 h-auto bg-gray-100/50 dark:bg-gray-700/50 text-xs rounded-lg p-1 w-full">
            <TabsTrigger 
              value="personal" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Personal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="experience" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Work</span>
            </TabsTrigger>
            <TabsTrigger 
              value="education" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Education</span>
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Skills</span>
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Projects</span>
            </TabsTrigger>
            <TabsTrigger 
              value="certifications" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Certs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="languages" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Lang</span>
            </TabsTrigger>
            <TabsTrigger 
              value="interests" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">Interests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="references" 
              className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-white/80"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs leading-none">References</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px]">
            <TabsContent value="personal" className="mt-0">
              <PersonalInfoForm 
                data={resumeData.personal} 
                onChange={onPersonalInfoChange} 
              />
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
              <ExperienceFormEnhanced 
                data={resumeData.experience} 
                onChange={onExperienceChange} 
              />
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <EducationForm 
                data={resumeData.education} 
                onChange={onEducationChange} 
              />
            </TabsContent>

            <TabsContent value="skills" className="mt-0">
              <SkillsForm 
                data={resumeData.skills} 
                onChange={onSkillsChange} 
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectsForm 
                data={resumeData.projects} 
                onChange={onProjectsChange} 
              />
            </TabsContent>

            <TabsContent value="certifications" className="mt-0">
              <CertificationsForm 
                data={resumeData.certifications} 
                onChange={onCertificationsChange} 
              />
            </TabsContent>

            <TabsContent value="languages" className="mt-0">
              <LanguagesForm 
                data={resumeData.languages} 
                onChange={onLanguagesChange} 
              />
            </TabsContent>

            <TabsContent value="interests" className="mt-0">
              <InterestsForm 
                data={resumeData.interests} 
                onChange={onInterestsChange} 
              />
            </TabsContent>

            <TabsContent value="references" className="mt-0">
              <ReferencesForm 
                data={resumeData.references} 
                onChange={onReferencesChange} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormSection;
