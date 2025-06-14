
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Heart,
  FolderOpen
} from 'lucide-react';

interface FormNavigationProps {
  activeTab: string;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'languages', label: 'Languages', icon: Languages },
    { id: 'interests', label: 'Interests', icon: Heart }
  ];

  return (
    <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6 h-auto bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-xl shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <TabsTrigger 
            key={tab.id}
            value={tab.id} 
            className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 rounded-lg transition-all hover:bg-white/50"
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium leading-none">{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default FormNavigation;
