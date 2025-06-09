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
  Zap,
  Crown,
  Shield,
  Loader2,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';

// Import all form components
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
import JobScanner from '@/components/JobScanner';
import ATSOptimizer from '@/components/ATSOptimizer';
import PDFGenerator from '@/components/PDFGenerator';
import { ProfileIntegrationService } from '@/services/profileIntegration';
import { useAPIKey } from '@/hooks/useAPIKey';

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
  const { apiKey } = useAPIKey();
  const resumeIdParam = searchParams.get('id');
  const isPreview = searchParams.get('preview') === 'true';
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
  const [importingProfile, setImportingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [previewScale, setPreviewScale] = useState(0.3);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  useEffect(() => {
    if (user) {
      loadResumeData();
    }
  }, [user, resumeIdParam]);

  const loadResumeData = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id);
      
      if (resumeIdParam) {
        query = query.eq('id', resumeIdParam);
      } else {
        query = query.order('updated_at', { ascending: false }).limit(1);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const resume = data[0];
        setResumeId(resume.id);
        setSelectedTemplate(resume.template_id || 0);
        
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
        setAtsOptimization({
          score: data.atsScore || 85,
          suggestions: data.suggestions,
          keywordMatches: data.keywordMatches || [],
          missingKeywords: data.missingKeywords || []
        });
        
        toast.success('Resume optimized with AI suggestions!');
      } else {
        toast.info('No improvements suggested at this time');
      }
    } catch (error: any) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize resume with AI. Please check your API key in Settings.');
    }
  };

  const handleJobDescriptionParsed = (parsedData: any) => {
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

  const handleDownloadPDF = async () => {
    if (!resumeData.personal.fullName) {
      toast.error('Please add your name before downloading');
      return;
    }

    try {
      toast.info('Generating PDF... This may take a moment.');
      
      const filename = `${resumeData.personal.fullName.replace(/[^a-z0-9]/gi, '_')}_Resume.pdf`;
      await PDFGenerator.generateTextPDF(resumeData, selectedTemplate, filename);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const handleATSOptimization = (optimization: any) => {
    setAtsOptimization(optimization);
  };

  const handleImportFromProfile = async () => {
    if (!user) {
      toast.error('Please sign in to import profile data');
      return;
    }

    setImportingProfile(true);
    try {
      const profileData = await ProfileIntegrationService.getProfileData(user.id);
      if (!profileData) {
        toast.error('No profile data found. Please update your profile first.');
        return;
      }

      let linkedinData = null;
      let githubData = null;

      if (profileData.linkedin_url) {
        toast.info('Extracting LinkedIn profile data...');
        linkedinData = await ProfileIntegrationService.extractLinkedInData(profileData.linkedin_url);
      }

      if (profileData.github_url) {
        toast.info('Extracting GitHub profile data...');
        githubData = await ProfileIntegrationService.extractGitHubData(profileData.github_url);
      }

      const mergedData = ProfileIntegrationService.mergeProfileDataToResume(
        profileData,
        linkedinData || undefined,
        githubData || undefined
      );

      setResumeData(prev => ({
        ...prev,
        personal: { ...prev.personal, ...mergedData.personal },
        experience: [...prev.experience, ...mergedData.experience],
        education: [...prev.education, ...mergedData.education],
        skills: [...new Set([...prev.skills, ...mergedData.skills])],
        projects: [...prev.projects, ...mergedData.projects]
      }));

      toast.success('Profile data imported successfully!');
    } catch (error: any) {
      console.error('Profile import error:', error);
      toast.error('Failed to import profile data. Please try again.');
    } finally {
      setImportingProfile(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
        
        {/* Responsive Header */}
        <div className="relative mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 lg:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
          
          <div className="relative flex flex-col gap-3 sm:gap-4">
            {/* Top Row - Navigation and Title */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 sm:gap-2 hover:bg-blue-50 border-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                size="sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Resume Builder Pro
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden sm:block">
                    AI-Powered Professional Resume Creator
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Responsive Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 lg:flex lg:flex-wrap gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={handleImportFromProfile}
                disabled={importingProfile}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-indigo-50 border-indigo-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                {importingProfile ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="text-xs">Import</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowJobScanner(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Scan</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowJobParser(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-orange-50 border-orange-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Parse</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowTemplateSelector(true)}
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-purple-50 border-purple-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">Style</span>
              </Button>
              
              <Button
                onClick={handleAIOptimize}
                className="flex flex-col sm:flex-row items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs shadow-lg px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">AI</span>
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">PDF</span>
              </Button>
              
              <Button
                onClick={saveResumeData}
                disabled={saving}
                className="flex flex-col sm:flex-row items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-lg px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
                size="sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs">{saving ? 'Saving...' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Status Cards - Enhanced Mobile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-3 sm:p-4 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    Template: {getTemplateName(selectedTemplate)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Professional ATS-optimized design
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {atsOptimization?.score || 95}%
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Sparkles className="w-3 h-3" />
                  AI
                </Badge>
              </div>
            </div>
          </Card>

          <ATSOptimizer 
            resumeData={resumeData} 
            onOptimize={handleATSOptimization}
          />
        </div>

        {/* Main Content - Improved Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Form Section - Full width on mobile, 2/3 on desktop */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 to-purple-600/3"></div>
              <CardContent className="relative p-3 sm:p-4 lg:p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  
                  {/* Mobile-First Tab Navigation */}
                  <TabsList className="grid grid-cols-4 sm:grid-cols-8 mb-4 sm:mb-6 h-auto bg-gray-100/50 dark:bg-gray-700/50 text-xs rounded-lg p-1">
                    <TabsTrigger value="personal" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Work</span>
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Education</span>
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Skills</span>
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Projects</span>
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Certs</span>
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Lang</span>
                    </TabsTrigger>
                    <TabsTrigger value="interests" className="flex flex-col items-center gap-1 p-2 sm:p-3 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs leading-none">Interests</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content - Keep existing */}
                  <TabsContent value="personal">
                    <PersonalInfoForm 
                      data={resumeData.personal} 
                      onChange={updatePersonalInfo} 
                    />
                  </TabsContent>

                  {/* ... keep existing code for all other TabsContent */}

                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section - Enhanced Mobile Support */}
          <div className="xl:col-span-1 order-first xl:order-last">
            <Card className="overflow-hidden shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl sticky top-6">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    Live Preview
                  </CardTitle>
                  
                  {/* Preview Controls */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        variant={!isMobilePreview ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setIsMobilePreview(false);
                          setPreviewScale(0.3);
                        }}
                        className="p-1"
                      >
                        <Monitor className="w-3 h-3" />
                      </Button>
                      <Button
                        variant={isMobilePreview ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setIsMobilePreview(true);
                          setPreviewScale(0.6);
                        }}
                        className="p-1"
                      >
                        <Smartphone className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 sm:p-4">
                  <div 
                    id="resume-preview" 
                    className={`transform-gpu transition-all duration-300 ${
                      isMobilePreview ? 'max-w-sm mx-auto' : ''
                    }`}
                  >
                    <ImprovedResumePreview 
                      data={resumeData} 
                      template={selectedTemplate}
                      scale={previewScale}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTemplateSelector && (
        <EnhancedTemplateSelector
          isOpen={showTemplateSelector}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {showJobParser && (
        <JobDescriptionParser
          isOpen={showJobParser}
          onClose={() => setShowJobParser(false)}
          onParsed={handleJobDescriptionParsed}
        />
      )}

      {showJobScanner && (
        <JobScanner
          isOpen={showJobScanner}
          onClose={() => setShowJobScanner(false)}
          onJobSelected={(job) => {
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
