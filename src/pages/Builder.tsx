import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  Wand2,
  FileText,
  Sparkles,
  ArrowLeft,
  Home,
  Search,
  Zap
} from 'lucide-react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ExperienceForm from '@/components/ExperienceForm';
import EducationForm from '@/components/EducationForm';
import SkillsForm from '@/components/SkillsForm';
import ProjectsForm from '@/components/ProjectsForm';
import CertificationsForm from '@/components/CertificationsForm';
import LanguagesForm from '@/components/LanguagesForm';
import InterestsForm from '@/components/InterestsForm';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import EnhancedTemplateSelector from '@/components/EnhancedTemplateSelector';
import JobDescriptionParser from '@/components/JobDescriptionParser';
import ATSOptimizer from '@/components/ATSOptimizer';
import PDFGenerator from '@/components/PDFGenerator';
import JobScanner from '@/components/JobScanner';

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
}

const Builder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTemplate = parseInt(searchParams.get('template') || '0');
  
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
    projects: []
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showJobParser, setShowJobParser] = useState(false);
  const [showJobScanner, setShowJobScanner] = useState(false);
  const [atsOptimization, setAtsOptimization] = useState<any>(null);

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
        
        // Safely handle the JSON data with proper type checking
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
          skills: Array.isArray(resume.skills) ? resume.skills as string[] : [],
          certifications: Array.isArray(resume.certifications) ? resume.certifications as ResumeData['certifications'] : [],
          languages: Array.isArray(resume.languages) ? resume.languages as ResumeData['languages'] : [],
          interests: Array.isArray(resume.interests) ? resume.interests as string[] : [],
          projects: Array.isArray(resume.projects) ? resume.projects as ResumeData['projects'] : []
        });
      }
    } catch (error: any) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume data');
    }
  };

  const saveResumeData = async () => {
    if (!user) return;

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

  const updateSkills = (data: string[]) => {
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

  const handleAIOptimize = async () => {
    if (!resumeData.personal.fullName) {
      toast.error('Please add personal information first');
      return;
    }

    try {
      const response = await supabase.functions.invoke('ai-optimize-resume', {
        body: { resumeData }
      });

      if (response.error) throw response.error;

      const optimizedData = response.data;
      setResumeData(prev => ({ ...prev, ...optimizedData }));
      toast.success('Resume optimized with AI suggestions!');
    } catch (error: any) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize resume with AI');
    }
  };

  const handleJobDescriptionParsed = (parsedData: any) => {
    // Update resume data with parsed information
    if (parsedData.skills) {
      updateSkills([...resumeData.skills, ...parsedData.skills]);
    }
    if (parsedData.experience) {
      updateExperience([...resumeData.experience, parsedData.experience]);
    }
    if (parsedData.summary) {
      updatePersonalInfo({
        ...resumeData.personal,
        summary: parsedData.summary
      });
    }
    setShowJobParser(false);
    toast.success('Job description parsed and applied to resume!');
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      toast.error('Resume preview not found');
      return;
    }

    PDFGenerator.generatePDF(element, `${resumeData.personal.fullName || 'Resume'}.pdf`)
      .then(() => {
        toast.success('PDF downloaded successfully!');
      })
      .catch(() => {
        toast.error('Failed to download PDF');
      });
  };

  const handleATSOptimization = (optimization: any) => {
    setAtsOptimization(optimization);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-xl">
          <CardTitle className="mb-4 text-2xl">Authentication Required</CardTitle>
          <p className="text-gray-600 mb-6">Please sign in to use the resume builder.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Enhanced Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                AI Resume Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Create your professional resume with AI assistance
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJobScanner(true)}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Job Scanner</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowJobParser(true)}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Parse Job</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
            <Button
              onClick={handleAIOptimize}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs sm:text-sm"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">AI Optimize</span>
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              onClick={saveResumeData}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : <span className="hidden sm:inline">Save</span>}
            </Button>
          </div>
        </div>

        {/* Template & ATS Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
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
                    Template {selectedTemplate + 1} - Professional design
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  ATS Score: {atsOptimization?.score || 85}%
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  AI Enhanced
                </Badge>
              </div>
            </div>
          </Card>

          <ATSOptimizer 
            resumeData={resumeData} 
            onOptimize={handleATSOptimization}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form Section - Takes 2 columns on XL screens */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
              <CardContent className="p-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6 h-auto">
                    <TabsTrigger value="personal" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <User className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Experience</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <Award className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <FolderOpen className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Projects</span>
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <Award className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Certs</span>
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <Languages className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Languages</span>
                    </TabsTrigger>
                    <TabsTrigger value="interests" className="flex flex-col sm:flex-row items-center gap-1 p-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Interests</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <PersonalInfoForm 
                      data={resumeData.personal} 
                      onChange={updatePersonalInfo} 
                    />
                  </TabsContent>

                  <TabsContent value="experience">
                    <ExperienceForm 
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
                    <SkillsForm 
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
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Preview Section - Takes 1 column on XL screens */}
          <div className="xl:col-span-1">
            <Card className="overflow-hidden shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 dark:bg-gray-800 p-4">
                  <div id="resume-preview" className="transform-gpu">
                    <ImprovedResumePreview 
                      data={resumeData} 
                      template={selectedTemplate}
                      scale={0.4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Template Selector Modal */}
      {showTemplateSelector && (
        <EnhancedTemplateSelector
          isOpen={showTemplateSelector}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Job Description Parser Modal */}
      {showJobParser && (
        <JobDescriptionParser
          isOpen={showJobParser}
          onClose={() => setShowJobParser(false)}
          onParsed={handleJobDescriptionParsed}
        />
      )}

      {/* Job Scanner Modal */}
      {showJobScanner && (
        <JobScanner
          isOpen={showJobScanner}
          onClose={() => setShowJobScanner(false)}
          onJobSelected={(job) => {
            // Auto-fill resume based on job requirements
            toast.success('Job requirements applied to resume!');
            setShowJobScanner(false);
          }}
        />
      )}
    </div>
  );
};

const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',     // 0
    'Executive Leadership',    // 1  
    'Classic Corporate',       // 2
    'Creative Designer',       // 3
    'Tech Specialist',         // 4
    'Minimalist Clean',        // 5
    'Two Column Layout',       // 6
    'Academic Scholar',        // 7
    'Sales Champion',          // 8
    'Startup Innovator',       // 9
    'Healthcare Professional', // 10
    'Finance Expert',          // 11
    'Marketing Creative',      // 12
    'Engineering Focus',       // 13
    'Legal Professional',      // 14
    'Consulting Elite'         // 15
  ];
  return names[index] || 'Modern Professional';
};

export default Builder;
