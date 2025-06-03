import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Download, 
  Save, 
  Plus,
  Trash2,
  ArrowLeft,
  Palette,
  Moon,
  Sun,
  Upload,
  Target,
  Brain,
  BarChart3,
  Settings,
  Zap,
  Globe,
  Heart,
  FolderOpen,
  FileText,
  Mail
} from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import TemplateSelector from '@/components/TemplateSelector';
import CVUploader from '@/components/CVUploader';
import ATSOptimizer from '@/components/ATSOptimizer';
import TemplateGallery from '@/components/TemplateGallery';
import LevelTemplateGallery from '@/components/LevelTemplateGallery';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AIEnhancements from '@/components/AIEnhancements';
import PersonalizationPanel from '@/components/PersonalizationPanel';
import IntegrationHub from '@/components/IntegrationHub';

const Builder = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState('personal');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [resumeData, setResumeData] = useState({
    id: '',
    title: 'Untitled Resume',
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    certifications: [] as any[],
    languages: [] as any[],
    interests: [] as string[],
    projects: [] as any[]
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (resumeId) {
      loadResume();
    } else {
      setLoading(false);
    }
  }, [user, resumeId, navigate]);

  const loadResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (error) throw error;

      setResumeData({
        id: data.id,
        title: data.title || 'Untitled Resume',
        personal: (data.personal_info as any) || {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          summary: ''
        },
        experience: (data.experience as any[]) || [],
        education: (data.education as any[]) || [],
        skills: (data.skills as string[]) || [],
        certifications: (data.certifications as any[]) || [],
        languages: (data.languages as any[]) || [],
        interests: (data.interests as string[]) || [],
        projects: (data.projects as any[]) || []
      });
      setSelectedTemplate(data.template_id || 0);
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const payload = {
        title: resumeData.title,
        template_id: selectedTemplate,
        personal_info: resumeData.personal,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        certifications: resumeData.certifications,
        languages: resumeData.languages,
        interests: resumeData.interests,
        projects: resumeData.projects
      };

      if (resumeId) {
        const { error } = await supabase
          .from('resumes')
          .update(payload)
          .eq('id', resumeId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('resumes')
          .insert([{ ...payload, user_id: user.id }])
          .select()
          .single();
        
        if (error) throw error;
        
        navigate(`/builder?id=${data.id}`, { replace: true });
        setResumeData(prev => ({ ...prev, id: data.id }));
      }

      // Track analytics
      if (resumeId) {
        await supabase.from('cv_analytics').insert({
          resume_id: resumeId,
          user_id: user.id,
          event_type: 'save',
          event_data: { template_id: selectedTemplate }
        });
      }

      toast({
        title: "Success",
        description: "Resume saved successfully"
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (!loading && resumeId) {
      const timer = setTimeout(() => {
        saveResume();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [resumeData, selectedTemplate, loading, resumeId]);

  const downloadPDF = async () => {
    try {
      if (resumeId) {
        await supabase.from('cv_analytics').insert({
          resume_id: resumeId,
          user_id: user?.id,
          event_type: 'download',
          event_data: { template_id: selectedTemplate }
        });
      }

      // Create a clean print version
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups to download PDF",
          variant: "destructive"
        });
        return;
      }

      // Generate clean HTML for PDF
      const resumeHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resumeData.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .name { font-size: 24px; font-weight: bold; }
            .contact { margin: 5px 0; }
            .section { margin: 20px 0; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
            .item { margin-bottom: 15px; }
            .item-title { font-weight: bold; }
            .item-subtitle { font-style: italic; color: #666; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 5px; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="name">${resumeData.personal.fullName}</div>
              <div class="contact">${resumeData.personal.email}</div>
              <div class="contact">${resumeData.personal.phone}</div>
              <div class="contact">${resumeData.personal.location}</div>
            </div>
            
            ${resumeData.personal.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <p>${resumeData.personal.summary}</p>
            </div>
            ` : ''}
            
            ${resumeData.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${resumeData.experience.map(exp => `
                <div class="item">
                  <div class="item-title">${exp.position} at ${exp.company}</div>
                  <div class="item-subtitle">${exp.startDate} - ${exp.endDate} | ${exp.location}</div>
                  <p>${exp.description}</p>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            ${resumeData.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${resumeData.education.map(edu => `
                <div class="item">
                  <div class="item-title">${edu.degree}</div>
                  <div class="item-subtitle">${edu.school} | ${edu.startDate} - ${edu.endDate}</div>
                  ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            ${resumeData.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills">
                ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
              </div>
            </div>
            ` : ''}
            
            ${resumeData.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${resumeData.projects.map(project => `
                <div class="item">
                  <div class="item-title">${project.name}</div>
                  <div class="item-subtitle">${project.technologies} | ${project.startDate} - ${project.endDate}</div>
                  <p>${project.description}</p>
                  ${project.link ? `<p>Link: ${project.link}</p>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(resumeHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      toast({
        title: "Download Started",
        description: "Your PDF is being generated"
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  const createCoverLetter = async () => {
    if (!resumeId) {
      toast({
        title: "Save Resume First",
        description: "Please save your resume before creating a cover letter",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .insert([{
          user_id: user?.id,
          resume_id: resumeId,
          title: `Cover Letter for ${resumeData.title}`,
          content: 'Your personalized cover letter content will be generated here...'
        }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/cover-letter-builder?id=${data.id}`);
    } catch (error) {
      console.error('Error creating cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to create cover letter",
        variant: "destructive"
      });
    }
  };

  const handleCVParsed = (data: any) => {
    setResumeData(prev => ({
      ...prev,
      personal: data.personal || prev.personal,
      experience: data.experience || prev.experience,
      education: data.education || prev.education,
      skills: data.skills || prev.skills,
      certifications: data.certifications || prev.certifications,
      languages: data.languages || prev.languages,
      interests: data.interests || prev.interests,
      projects: data.projects || prev.projects
    }));
    
    toast({
      title: "CV Imported Successfully",
      description: "Your information has been populated in the form"
    });
  };

  const handleATSOptimize = (suggestions: any) => {
    toast({
      title: "ATS Analysis Complete",
      description: `Your resume scored ${suggestions.score}% ATS compatibility`
    });
  };

  const handleAISuggestion = (suggestion: any) => {
    // Apply AI suggestion to resume data
    switch (suggestion.section) {
      case 'personal':
        if (suggestion.suggestion_type === 'grammar') {
          setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, summary: suggestion.suggested_text }
          }));
        }
        break;
      case 'skills':
        if (suggestion.suggestion_type === 'keywords') {
          const newSkills = suggestion.suggested_text.split(',').map((s: string) => s.trim());
          setResumeData(prev => ({
            ...prev,
            skills: [...new Set([...prev.skills, ...newSkills])]
          }));
        }
        break;
    }
  };

  const handleDataImport = (data: any, source: string) => {
    setResumeData(prev => ({
      ...prev,
      ...data
    }));
    
    toast({
      title: `${source.charAt(0).toUpperCase() + source.slice(1)} Import Complete`,
      description: "Your resume has been updated with imported data"
    });
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      school: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Languages functions
  const addLanguage = () => {
    const newLang = {
      id: Date.now(),
      language: '',
      proficiency: 'Beginner'
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const updateLanguage = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  // Projects functions
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  // Interests functions
  const addInterest = (interest: string) => {
    if (interest.trim() && !resumeData.interests.includes(interest.trim())) {
      setResumeData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // Certifications functions
  const addCertification = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={resumeData.title}
              onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold border-0 p-0 bg-transparent dark:text-white"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={createCoverLetter}
              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400"
            >
              <Mail className="w-4 h-4 mr-2" />
              Create Cover Letter
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowTemplateGallery(true)}
              className="border-gray-300 dark:border-gray-600"
            >
              <Palette className="w-4 h-4 mr-2" />
              Templates ({selectedTemplate + 1})
            </Button>
            <Button 
              variant="outline" 
              onClick={saveResume}
              disabled={saving}
              className="border-gray-300 dark:border-gray-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
                  <TabsTrigger value="personal" className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-1">
                    <FolderOpen className="w-3 h-3" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="languages" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Languages
                  </TabsTrigger>
                  <TabsTrigger value="interests" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Interests
                  </TabsTrigger>
                  <TabsTrigger value="certifications" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Certificates
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-4">
                  <CVUploader onParsed={handleCVParsed} />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="dark:text-gray-200">Full Name</Label>
                      <Input
                        id="fullName"
                        value={resumeData.personal.fullName || ''}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personal.email || ''}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="dark:text-gray-200">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personal.phone || ''}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="dark:text-gray-200">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personal.location || ''}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="summary" className="dark:text-gray-200">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={resumeData.personal.summary || ''}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      className="mt-1 min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Write a compelling summary of your professional background..."
                    />
                  </div>
                  <IntegrationHub onDataImport={handleDataImport} />
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                  {resumeData.projects.map((project) => (
                    <Card key={project.id} className="p-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Project</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="dark:text-gray-200">Project Name</Label>
                          <Input
                            value={project.name}
                            onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Technologies</Label>
                          <Input
                            value={project.technologies}
                            onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Project Link</Label>
                          <Input
                            value={project.link}
                            onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="dark:text-gray-200">Start Date</Label>
                            <Input
                              value={project.startDate}
                              onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                              className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                              placeholder="Jan 2023"
                            />
                          </div>
                          <div>
                            <Label className="dark:text-gray-200">End Date</Label>
                            <Input
                              value={project.endDate}
                              onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                              className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                              placeholder="Present"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="dark:text-gray-200">Description</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          className="mt-1 min-h-[80px] dark:bg-gray-600 dark:border-gray-500"
                          placeholder="Describe the project, your role, and key achievements..."
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    onClick={addProject}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </TabsContent>

                {/* Languages Tab */}
                <TabsContent value="languages" className="space-y-6">
                  {resumeData.languages.map((lang) => (
                    <Card key={lang.id} className="p-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Language</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLanguage(lang.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="dark:text-gray-200">Language</Label>
                          <Input
                            value={lang.language}
                            onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="English, Spanish, French..."
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Proficiency</Label>
                          <select
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-600 dark:text-white"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Native">Native</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    onClick={addLanguage}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </TabsContent>

                {/* Interests Tab */}
                <TabsContent value="interests" className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-200">Interests & Hobbies</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {resumeData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {interest}
                          <button
                            onClick={() => removeInterest(interest)}
                            className="text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an interest and press Enter"
                        className="dark:bg-gray-700 dark:border-gray-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addInterest(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add an interest and press Enter"]') as HTMLInputElement;
                          if (input) {
                            addInterest(input.value);
                            input.value = '';
                          }
                        }}
                        variant="outline"
                        className="dark:border-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Certifications Tab */}
                <TabsContent value="certifications" className="space-y-6">
                  {resumeData.certifications.map((cert) => (
                    <Card key={cert.id} className="p-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Certification</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="dark:text-gray-200">Certification Name</Label>
                          <Input
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Issuing Organization</Label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Date Obtained</Label>
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="Jan 2023"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Credential ID (Optional)</Label>
                          <Input
                            value={cert.credentialId}
                            onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    onClick={addCertification}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6">
                  {resumeData.experience.map((exp) => (
                    <Card key={exp.id} className="p-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Work Experience</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="dark:text-gray-200">Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="dark:text-gray-200">Start Date</Label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                              placeholder="2020"
                            />
                          </div>
                          <div>
                            <Label className="dark:text-gray-200">End Date</Label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                              placeholder="Present"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="dark:text-gray-200">Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          className="mt-1 min-h-[80px] dark:bg-gray-600 dark:border-gray-500"
                          placeholder="Describe your key responsibilities and achievements..."
                        />
                      </div>
                    </Card>
                  ))}
                  <Button
                    onClick={addExperience}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                  <AIEnhancements resumeData={resumeData} onApplySuggestion={handleAISuggestion} />
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6">
                  {resumeData.education.map((edu) => (
                    <Card key={edu.id} className="p-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Education</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="dark:text-gray-200">School</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">GPA (Optional)</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="3.8/4.0"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">Start Date</Label>
                          <Input
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="2016"
                          />
                        </div>
                        <div>
                          <Label className="dark:text-gray-200">End Date</Label>
                          <Input
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="mt-1 dark:bg-gray-600 dark:border-gray-500"
                            placeholder="2020"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    onClick={addEducation}
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-200">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {resumeData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill and press Enter"
                        className="dark:bg-gray-700 dark:border-gray-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a skill and press Enter"]') as HTMLInputElement;
                          if (input) {
                            addSkill(input.value);
                            input.value = '';
                          }
                        }}
                        variant="outline"
                        className="dark:border-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <ATSOptimizer resumeData={resumeData} onOptimize={handleATSOptimize} />
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-4">
                  <AnalyticsDashboard resumeId={resumeId} />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <PersonalizationPanel onBrandingChange={() => {}} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-24">
            <ResumePreview 
              data={resumeData} 
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>

      {/* Template Gallery Modal */}
      {showTemplateGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Choose Template ({selectedTemplate + 1} of 20+ templates)
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowTemplateGallery(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <LevelTemplateGallery
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(templateId) => {
                  setSelectedTemplate(templateId);
                  setShowTemplateGallery(false);
                  toast({
                    title: "Template Updated",
                    description: `Switched to template ${templateId + 1}`
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
