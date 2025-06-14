
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Heart,
  FolderOpen,
  Palette,
  Download,
  Save,
  Eye,
  Upload,
  FileText,
  Sparkles,
  Brain
} from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceFormEnhanced from './ExperienceFormEnhanced';
import EducationForm from './EducationForm';
import EnhancedSkillsForm from './EnhancedSkillsForm';
import ProjectsForm from './ProjectsForm';
import CertificationsForm from './CertificationsForm';
import LanguagesForm from './LanguagesForm';
import InterestsForm from './InterestsForm';
import ImprovedResumePreview from './ImprovedResumePreview';
import EnhancedTemplateSelector from './EnhancedTemplateSelector';
import EnhancedCVExtractor from './EnhancedCVExtractor';
import EnhancedJobDescriptionParser from './EnhancedJobDescriptionParser';
import ComingSoonFeatures from './ComingSoonFeatures';
import LiveFeatures from './LiveFeatures';
import AIIntegration from './AIIntegration';
import ReferencesForm from './ReferencesForm';
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
  skills: string[] | Array<{
    name: string;
    level: string;
    category: string;
  }>;
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
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showCVExtractor, setShowCVExtractor] = useState(false);
  const [showJobParser, setShowJobParser] = useState(false);
  const [showAIIntegration, setShowAIIntegration] = useState(false);
  const [showLiveFeatures, setShowLiveFeatures] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [references, setReferences] = useState<any[]>([]);
  const [customColors, setCustomColors] = useState<any>(null);

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
          skills: Array.isArray(resume.skills) ? resume.skills as any : [],
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

  const updatePersonalInfo = (data: any) => {
    setResumeData(prev => ({ ...prev, personal: data }));
  };

  const updateExperience = (data: any[]) => {
    setResumeData(prev => ({ ...prev, experience: data }));
  };

  const updateEducation = (data: any[]) => {
    setResumeData(prev => ({ ...prev, education: data }));
  };

  const updateSkills = (data: any) => {
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

  const handleCVDataExtracted = (data: any) => {
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
      references: prevData.references,
      custom_colors: prevData.custom_colors
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

    if (data.experience && data.jobTitle) {
      const tailoredExperience = {
        id: Date.now(),
        position: data.jobTitle,
        company: data.company || 'Target Company',
        location: data.location || '',
        startDate: '',
        endDate: '',
        description: `• Applied ${data.skills?.technical?.slice(0, 3).join(', ')} to deliver results\n• Demonstrated expertise in ${data.skills?.soft?.slice(0, 2).join(' and ')}\n• Collaborated with cross-functional teams to achieve objectives`
      };

      setResumeData(prev => ({
        ...prev,
        experience: [tailoredExperience, ...prev.experience]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enhanced Resume Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">Create your professional resume with AI-powered tools and enhanced templates</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCVExtractor(true)}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload CV
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowJobParser(true)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Job Parser
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAIIntegration(true)}
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Tools
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLiveFeatures(true)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Live Features
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Templates
            </Button>
            <Button
              onClick={saveResumeData}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Resume'}
            </Button>
          </div>
        </div>

        {/* Current Template Info */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Template: {getTemplateName(selectedTemplate)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Template {selectedTemplate + 1} - Professional design with excellent ATS compatibility
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800">
                  ATS Score: 95%
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Color Customizer */}
        <div className="mb-6">
          <ColorCustomizer onColorChange={handleColorChange} currentColors={customColors} />
        </div>

        {showLiveFeatures ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Features & Tools</h2>
              <Button variant="outline" onClick={() => setShowLiveFeatures(false)}>
                Back to Builder
              </Button>
            </div>
            <LiveFeatures resumeData={resumeData} onResumeUpdate={setResumeData} />
          </div>
        ) : showAIIntegration ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Integration</h2>
              <Button variant="outline" onClick={() => setShowAIIntegration(false)}>
                Back to Builder
              </Button>
            </div>
            <AIIntegration />
          </div>
        ) : showComingSoon ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Features</h2>
              <Button variant="outline" onClick={() => setShowComingSoon(false)}>
                Back to Builder
              </Button>
            </div>
            <ComingSoonFeatures />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-5 lg:grid-cols-9 mb-6">
                  <TabsTrigger value="personal" className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="hidden sm:inline">Experience</span>
                  </TabsTrigger>
                  <TabsTrigger value="education" className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="hidden sm:inline">Education</span>
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                  <TabsTrigger value="certifications" className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span className="hidden sm:inline">Certs</span>
                  </TabsTrigger>
                  <TabsTrigger value="languages" className="flex items-center gap-1">
                    <Languages className="w-4 h-4" />
                    <span className="hidden sm:inline">Languages</span>
                  </TabsTrigger>
                  <TabsTrigger value="interests" className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Interests</span>
                  </TabsTrigger>
                  <TabsTrigger value="references" className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">References</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <PersonalInfoForm 
                    data={resumeData.personal} 
                    onChange={updatePersonalInfo} 
                  />
                </TabsContent>

                <TabsContent value="experience">
                  <ExperienceFormEnhanced 
                    data={resumeData.experience} 
                    onChange={updateExperience} 
                  />
                </TabsContent>

                <TabsContent value="education">
                  <EducationForm 
                    data={resumeData.education} 
                    onChange={updateEducation} 
                  />
                </TabsContent>

                <TabsContent value="skills">
                  <EnhancedSkillsForm 
                    data={resumeData.skills} 
                    onChange={updateSkills} 
                  />
                </TabsContent>

                <TabsContent value="projects">
                  <ProjectsForm 
                    data={resumeData.projects} 
                    onChange={updateProjects} 
                  />
                </TabsContent>

                <TabsContent value="certifications">
                  <CertificationsForm 
                    data={resumeData.certifications} 
                    onChange={updateCertifications} 
                  />
                </TabsContent>

                <TabsContent value="languages">
                  <LanguagesForm 
                    data={resumeData.languages} 
                    onChange={updateLanguages} 
                  />
                </TabsContent>

                <TabsContent value="interests">
                  <InterestsForm 
                    data={resumeData.interests} 
                    onChange={updateInterests} 
                  />
                </TabsContent>

                <TabsContent value="references">
                  <ReferencesForm 
                    data={references} 
                    onChange={updateReferences} 
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-8">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4">
                    <ImprovedResumePreview 
                      data={resumeData} 
                      template={selectedTemplate}
                      scale={0.6}
                      customColors={customColors}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CV Extractor Modal */}
      {showCVExtractor && (
        <EnhancedCVExtractor
          onDataExtracted={handleCVDataExtracted}
          onClose={() => setShowCVExtractor(false)}
        />
      )}

      {/* Enhanced Job Description Parser Modal */}
      <EnhancedJobDescriptionParser
        isOpen={showJobParser}
        onClose={() => setShowJobParser(false)}
        onParsed={handleJobDescriptionParsed}
      />

      {/* Template Selector Modal */}
      <EnhancedTemplateSelector
        isOpen={showTemplateSelector}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        onClose={() => setShowTemplateSelector(false)}
      />
    </div>
  );
};

const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',     // 0
    'Executive Leadership',    // 1  
    'Creative Designer',       // 2
    'Tech Specialist',         // 3
    'Minimalist Clean',        // 4
    'Corporate Classic',       // 5
    'Professional Blue',       // 6
    'Legal Professional',      // 7
    'Engineering Focus',       // 8
    'Data Specialist',         // 9
    'Supply Chain Manager',    // 10
    'Clean Modern',            // 11
    'Marketing Creative',      // 12
    'Academic Scholar',        // 13
    'Sales Champion',          // 14
    'Consulting Elite',        // 15
    'Modern Creative',         // 16
    'Creative Portfolio',      // 17
    'Minimalist Elegant',      // 18
    'Tech Innovator',          // 19
    'Executive Elite',         // 20
    'Creative Designer Pro'    // 21
  ];
  return names[index] || 'Modern Professional';
};

export default ResumeBuilder;
