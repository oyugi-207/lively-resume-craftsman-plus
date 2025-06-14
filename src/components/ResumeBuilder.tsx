
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAPIKey } from '@/hooks/useAPIKey';

// Import new components
import BuilderHeader from './builder/BuilderHeader';
import FormNavigation from './builder/FormNavigation';
import PreviewSection from './builder/PreviewSection';

// Import form components
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceFormEnhanced from './ExperienceFormEnhanced';
import EducationForm from './EducationForm';
import EnhancedSkillsForm from './EnhancedSkillsForm';
import CertificationsFormEnhanced from './enhanced-forms/CertificationsFormEnhanced';
import LanguagesFormEnhanced from './enhanced-forms/LanguagesFormEnhanced';
import InterestsFormEnhanced from './enhanced-forms/InterestsFormEnhanced';
import ProjectsFormEnhanced from './enhanced-forms/ProjectsFormEnhanced';
import ReferencesFormEnhanced from './enhanced-forms/ReferencesFormEnhanced';

// Import modal components
import EnhancedTemplateSelector from './EnhancedTemplateSelector';
import EnhancedCVExtractor from './EnhancedCVExtractor';
import EnhancedJobDescriptionParser from './EnhancedJobDescriptionParser';
import AIIntegration from './AIIntegration';
import LiveFeatures from './LiveFeatures';
import ComingSoonFeatures from './ComingSoonFeatures';
import ColorCustomizer from './ColorCustomizer';

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
    description?: string;
    courses?: string;
    honors?: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    category: string;
  }> | string[];
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
  custom_colors: any;
}

const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const { apiKey } = useAPIKey();
  
  // State management
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    interests: [],
    projects: [],
    references: [],
    custom_colors: null
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [importingProfile, setImportingProfile] = useState(false);
  
  // Modal states
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showCVExtractor, setShowCVExtractor] = useState(false);
  const [showJobParser, setShowJobParser] = useState(false);
  const [showAIIntegration, setShowAIIntegration] = useState(false);
  const [showLiveFeatures, setShowLiveFeatures] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  // Additional state
  const [references, setReferences] = useState<any[]>([]);
  const [customColors, setCustomColors] = useState<any>(null);
  const [atsScore, setAtsScore] = useState(95);

  useEffect(() => {
    if (user) {
      loadResumeData();
    }
  }, [user]);

  const loadResumeData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const resume = data[0];
        setResumeId(resume.id);
        setSelectedTemplate(resume.template_id || 0);
        
        // Handle references and custom_colors safely
        const resumeReferences = (resume as any).references || [];
        const resumeCustomColors = (resume as any).custom_colors || null;
        
        setReferences(Array.isArray(resumeReferences) ? resumeReferences : []);
        setCustomColors(resumeCustomColors);
        
        // Properly handle skills data from Supabase
        const normalizeSkills = (skillsData: any): Array<{name: string; level: string; category: string}> | string[] => {
          if (!Array.isArray(skillsData)) return [];
          
          // Check if it's an array of objects with name, level, category
          if (skillsData.length > 0 && typeof skillsData[0] === 'object' && 'name' in skillsData[0]) {
            return skillsData as Array<{name: string; level: string; category: string}>;
          }
          
          // Otherwise treat as string array
          return skillsData.map(skill => typeof skill === 'string' ? skill : String(skill));
        };
        
        setResumeData({
          personal: resume.personal_info && typeof resume.personal_info === 'object' && !Array.isArray(resume.personal_info) 
            ? resume.personal_info as ResumeData['personal']
            : {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                summary: ''
              },
          experience: Array.isArray(resume.experience) ? resume.experience as ResumeData['experience'] : [],
          education: Array.isArray(resume.education) ? resume.education as ResumeData['education'] : [],
          skills: normalizeSkills(resume.skills),
          certifications: Array.isArray(resume.certifications) ? resume.certifications as ResumeData['certifications'] : [],
          languages: Array.isArray(resume.languages) ? resume.languages as ResumeData['languages'] : [],
          interests: Array.isArray(resume.interests) ? resume.interests as string[] : [],
          projects: Array.isArray(resume.projects) ? resume.projects as ResumeData['projects'] : [],
          references: Array.isArray(resumeReferences) ? resumeReferences : [],
          custom_colors: resumeCustomColors
        });
      }
    } catch (error: any) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume data');
    }
  };

  const saveResumeData = async () => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return;
    }

    setSaving(true);
    try {
      const resumePayload = {
        user_id: user.id,
        title: resumeData.personal.fullName ? `${resumeData.personal.fullName}'s Resume` : 'Untitled Resume',
        template_id: selectedTemplate,
        personal_info: resumeData.personal,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        certifications: resumeData.certifications,
        languages: resumeData.languages,
        interests: resumeData.interests,
        projects: resumeData.projects,
        references: references,
        custom_colors: customColors,
        updated_at: new Date().toISOString()
      };

      if (resumeId) {
        const { error } = await supabase
          .from('resumes')
          .update(resumePayload)
          .eq('id', resumeId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('resumes')
          .insert([resumePayload])
          .select()
          .single();
        
        if (error) throw error;
        setResumeId(data.id);
      }

      toast.success('Resume saved successfully!');
    } catch (error: any) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  // Update functions
  const updatePersonalInfo = (data: any) => {
    setResumeData(prev => ({ ...prev, personal: data }));
  };

  const updateExperience = (data: any[]) => {
    setResumeData(prev => ({ ...prev, experience: data }));
  };

  const updateEducation = (data: any[]) => {
    setResumeData(prev => ({ ...prev, education: data }));
  };

  const updateSkills = (data: Array<{name: string; level: string; category: string}> | string[]) => {
    setResumeData(prev => ({ ...prev, skills: data }));
  };

  const updateProjects = (data: any[]) => {
    setResumeData(prev => ({ ...prev, projects: data }));
  };

  const updateCertifications = (data: any[]) => {
    setResumeData(prev => ({ ...prev, certifications: data }));
  };

  const updateLanguages = (data: any[]) => {
    setResumeData(prev => ({ ...prev, languages: data }));
  };

  const updateInterests = (data: string[]) => {
    setResumeData(prev => ({ ...prev, interests: data }));
  };

  const updateReferences = (data: any[]) => {
    setReferences(data);
    setResumeData(prev => ({ ...prev, references: data }));
  };

  const handleColorChange = (colors: any) => {
    setCustomColors(colors);
    setResumeData(prev => ({ ...prev, custom_colors: colors }));
  };

  // AI and other handlers
  const handleAIOptimize = async () => {
    if (!resumeData.personal.fullName) {
      toast.error('Please add personal information first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    try {
      toast.info('AI is optimizing your resume...');
      
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          resumeData,
          apiKey 
        }
      });

      if (error) throw error;

      if (data?.suggestions?.length > 0) {
        let updatedData = { ...resumeData };
        
        data.suggestions.forEach((suggestion: any) => {
          if (suggestion.section === 'summary' && suggestion.confidence > 0.7) {
            updatedData.personal.summary = suggestion.suggested;
          }
        });
        
        setResumeData(updatedData);
        setAtsScore(data.atsScore || 85);
        
        toast.success('Resume optimized with AI suggestions!');
      } else {
        toast.info('No improvements suggested at this time');
      }
    } catch (error: any) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize resume with AI. Please check your API key in Settings.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData.personal.fullName) {
      toast.error('Please add your name before downloading');
      return;
    }
    toast.info('PDF download feature will be implemented soon!');
  };

  const handleImportProfile = async () => {
    setImportingProfile(true);
    // Simulate import
    setTimeout(() => {
      setImportingProfile(false);
      toast.success('Profile import feature will be implemented soon!');
    }, 2000);
  };

  const handleCVDataExtracted = (data: any) => {
    // Handle CV data extraction
    setResumeData(prevData => ({
      ...prevData,
      personal: {
        ...prevData.personal,
        ...data.personal
      },
      experience: data.experience.length > 0 ? data.experience : prevData.experience,
      education: data.education.length > 0 ? data.education : prevData.education,
      skills: data.skills.length > 0 ? [...(Array.isArray(prevData.skills) ? prevData.skills : []), ...data.skills] : prevData.skills,
      projects: data.projects.length > 0 ? data.projects : prevData.projects,
      certifications: data.certifications.length > 0 ? data.certifications : prevData.certifications,
      languages: data.languages.length > 0 ? data.languages : prevData.languages,
      interests: data.interests.length > 0 ? [...new Set([...prevData.interests, ...data.interests])] : prevData.interests,
    }));
    toast.success('CV data successfully imported and merged with existing data!');
  };

  const handleJobDescriptionParsed = (data: any) => {
    if (data.summary) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          summary: data.summary
        }
      }));
    }

    if (data.skills && data.skills.technical) {
      const newSkills = data.skills.technical.slice(0, 10);
      setResumeData(prev => ({
        ...prev,
        skills: Array.isArray(prev.skills) ? [...prev.skills, ...newSkills] : newSkills
      }));
    }
  };

  // Convert skills to string array for EnhancedSkillsForm compatibility
  const skillsForForm = Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'object' 
    ? (resumeData.skills as Array<{name: string; level: string; category: string}>).map(skill => skill.name)
    : resumeData.skills as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Enhanced Header */}
        <BuilderHeader
          selectedTemplate={selectedTemplate}
          atsScore={atsScore}
          saving={saving}
          importingProfile={importingProfile}
          onShowCVParser={() => setShowCVExtractor(true)}
          onImportProfile={handleImportProfile}
          onShowJobScanner={() => toast.info('Job Scanner feature coming soon!')}
          onShowJobParser={() => setShowJobParser(true)}
          onShowTemplateSelector={() => setShowTemplateSelector(true)}
          onAIOptimize={handleAIOptimize}
          onDownloadPDF={handleDownloadPDF}
          onSave={saveResumeData}
        />

        {/* Color Customizer */}
        <div className="mb-6">
          <ColorCustomizer onColorChange={handleColorChange} currentColors={customColors} />
        </div>

        {/* Feature Sections */}
        {showLiveFeatures ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Features & Tools</h2>
              <button onClick={() => setShowLiveFeatures(false)} className="text-blue-600 hover:text-blue-700">
                Back to Builder
              </button>
            </div>
            <LiveFeatures resumeData={resumeData} onResumeUpdate={setResumeData} />
          </div>
        ) : showAIIntegration ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Integration</h2>
              <button onClick={() => setShowAIIntegration(false)} className="text-blue-600 hover:text-blue-700">
                Back to Builder
              </button>
            </div>
            <AIIntegration />
          </div>
        ) : showComingSoon ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Features</h2>
              <button onClick={() => setShowComingSoon(false)} className="text-blue-600 hover:text-blue-700">
                Back to Builder
              </button>
            </div>
            <ComingSoonFeatures />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Form Section */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-purple-600/3 to-indigo-600/3 rounded-3xl"></div>
                <CardContent className="relative p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    
                    <FormNavigation activeTab={activeTab} />

                    <TabsContent value="personal" className="mt-8">
                      <PersonalInfoForm 
                        data={resumeData.personal} 
                        onChange={updatePersonalInfo} 
                      />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-8">
                      <ExperienceFormEnhanced 
                        data={resumeData.experience} 
                        onChange={updateExperience} 
                      />
                    </TabsContent>

                    <TabsContent value="education" className="mt-8">
                      <EducationForm 
                        data={resumeData.education} 
                        onChange={updateEducation} 
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-8">
                      <EnhancedSkillsForm 
                        data={skillsForForm} 
                        onChange={updateSkills} 
                      />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-8">
                      <ProjectsFormEnhanced 
                        data={resumeData.projects} 
                        onChange={updateProjects} 
                      />
                    </TabsContent>

                    <TabsContent value="certifications" className="mt-8">
                      <CertificationsFormEnhanced 
                        data={resumeData.certifications} 
                        onChange={updateCertifications} 
                      />
                    </TabsContent>

                    <TabsContent value="languages" className="mt-8">
                      <LanguagesFormEnhanced 
                        data={resumeData.languages} 
                        onChange={updateLanguages} 
                      />
                    </TabsContent>

                    <TabsContent value="interests" className="mt-8">
                      <InterestsFormEnhanced 
                        data={resumeData.interests} 
                        onChange={updateInterests} 
                      />
                    </TabsContent>

                    <TabsContent value="references" className="mt-8">
                      <ReferencesFormEnhanced 
                        data={references} 
                        onChange={updateReferences} 
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="xl:col-span-1">
              <PreviewSection
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                customColors={customColors}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCVExtractor && (
        <EnhancedCVExtractor
          onDataExtracted={handleCVDataExtracted}
          onClose={() => setShowCVExtractor(false)}
        />
      )}

      <EnhancedJobDescriptionParser
        isOpen={showJobParser}
        onClose={() => setShowJobParser(false)}
        onParsed={handleJobDescriptionParsed}
      />

      <EnhancedTemplateSelector
        isOpen={showTemplateSelector}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        onClose={() => setShowTemplateSelector(false)}
      />
    </div>
  );
};

export default ResumeBuilder;
