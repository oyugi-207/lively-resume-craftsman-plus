import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

// Import form components
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import LanguagesForm from '@/components/forms/LanguagesForm';
import InterestsForm from '@/components/forms/InterestsForm';
import ReferencesForm from '@/components/forms/ReferencesForm';
import EnhancedSkillsForm from '@/components/EnhancedSkillsForm';
import CertificationsFormEnhanced from '@/components/CertificationsFormEnhanced';
import LanguagesFormEnhanced from '@/components/LanguagesFormEnhanced';
import InterestsFormEnhanced from '@/components/InterestsFormEnhanced';
import ReferencesFormEnhanced from '@/components/ReferencesFormEnhanced';
import PersonalInfoFormEnhanced from '@/components/enhanced-forms/PersonalInfoFormEnhanced';
import ExperienceFormEnhanced from '@/components/enhanced-forms/ExperienceFormEnhanced';
import ProjectsFormEnhanced from '@/components/enhanced-forms/ProjectsFormEnhanced';

interface FormSectionProps {
  resumeData: any;
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
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoFormEnhanced
            data={resumeData.personal}
            onChange={onPersonalInfoChange}
          />
        );
      case 'experience':
        return (
          <ExperienceFormEnhanced
            data={resumeData.experience}
            onChange={onExperienceChange}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onChange={onEducationChange}
          />
        );
      case 'skills':
        return (
          <EnhancedSkillsForm
            data={resumeData.skills}
            onChange={onSkillsChange}
          />
        );
      case 'projects':
        return (
          <ProjectsFormEnhanced
            data={resumeData.projects}
            onChange={onProjectsChange}
          />
        );
      case 'certifications':
        return (
          <CertificationsFormEnhanced
            data={resumeData.certifications}
            onChange={onCertificationsChange}
          />
        );
      case 'languages':
        return (
          <LanguagesFormEnhanced
            data={resumeData.languages}
            onChange={onLanguagesChange}
          />
        );
      case 'interests':
        return (
          <InterestsFormEnhanced
            data={resumeData.interests}
            onChange={onInterestsChange}
          />
        );
      case 'references':
        return (
          <ReferencesFormEnhanced
            data={resumeData.references}
            onChange={onReferencesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="bg-white/80 dark:bg-gray-900/80 border rounded-lg shadow-sm flex justify-between">
        <div className="flex overflow-x-auto hide-scrollbar">
          <TabsTrigger value="personal" onClick={() => onTabChange('personal')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Personal
          </TabsTrigger>
          <TabsTrigger value="experience" onClick={() => onTabChange('experience')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" onClick={() => onTabChange('education')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Education
          </TabsTrigger>
          <TabsTrigger value="skills" onClick={() => onTabChange('skills')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Skills
          </TabsTrigger>
          <TabsTrigger value="projects" onClick={() => onTabChange('projects')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Projects
          </TabsTrigger>
          <TabsTrigger value="certifications" onClick={() => onTabChange('certifications')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Certifications
          </TabsTrigger>
          <TabsTrigger value="languages" onClick={() => onTabChange('languages')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Languages
          </TabsTrigger>
          <TabsTrigger value="interests" onClick={() => onTabChange('interests')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            Interests
          </TabsTrigger>
          <TabsTrigger value="references" onClick={() => onTabChange('references')} className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-50">
            References
          </TabsTrigger>
        </div>
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
          <Sparkles className="mr-1 w-4 h-4" />
          AI-Powered
        </Badge>
      </TabsList>
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </Tabs>
  );
};

export default FormSection;
