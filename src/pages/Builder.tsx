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
  Eye,
  Plus,
  Trash2,
  ArrowLeft,
  Palette,
  Moon,
  Sun
} from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import TemplateSelector from '@/components/TemplateSelector';

const Builder = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState('personal');
  const [showTemplates, setShowTemplates] = useState(false);
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
    certifications: [] as any[]
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
        title: data.title,
        personal: data.personal_info || {},
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        certifications: data.certifications || []
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
        certifications: resumeData.certifications
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
        
        // Update URL with new resume ID
        navigate(`/builder?id=${data.id}`, { replace: true });
        setResumeData(prev => ({ ...prev, id: data.id }));
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
              onClick={() => setShowTemplates(true)}
              className="border-gray-300 dark:border-gray-600"
            >
              <Palette className="w-4 h-4 mr-2" />
              Templates
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Skills
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-4">
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
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-24">
            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplates && (
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default Builder;
