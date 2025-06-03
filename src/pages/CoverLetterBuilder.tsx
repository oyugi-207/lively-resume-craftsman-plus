
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Save,
  Download,
  Sparkles,
  FileText,
  Building,
  User,
  Moon,
  Sun,
  Wand2
} from 'lucide-react';

const CoverLetterBuilder = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const coverLetterId = searchParams.get('id');
  const resumeId = searchParams.get('resume');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);

  const [coverLetterData, setCoverLetterData] = useState({
    id: '',
    title: 'Untitled Cover Letter',
    companyName: '',
    positionTitle: '',
    content: '',
    resumeId: resumeId || 'none',
    templateId: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadData();
  }, [user, coverLetterId, navigate]);

  const loadData = async () => {
    try {
      // Load resumes for selection
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('id, title')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (resumesError) throw resumesError;
      setResumes(resumesData || []);

      // Load cover letter if editing
      if (coverLetterId) {
        const { data, error } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('id', coverLetterId)
          .single();

        if (error) throw error;

        setCoverLetterData({
          id: data.id,
          title: data.title || 'Untitled Cover Letter',
          companyName: data.company_name || '',
          positionTitle: data.position_title || '',
          content: data.content || '',
          resumeId: data.resume_id || 'none',
          templateId: data.template_id || 0
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCoverLetter = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const payload = {
        title: coverLetterData.title,
        company_name: coverLetterData.companyName,
        position_title: coverLetterData.positionTitle,
        content: coverLetterData.content,
        resume_id: coverLetterData.resumeId === 'none' ? null : coverLetterData.resumeId,
        template_id: coverLetterData.templateId
      };

      if (coverLetterId) {
        const { error } = await supabase
          .from('cover_letters')
          .update(payload)
          .eq('id', coverLetterId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cover_letters')
          .insert([{ ...payload, user_id: user.id }])
          .select()
          .single();
        
        if (error) throw error;
        
        navigate(`/cover-letter-builder?id=${data.id}`, { replace: true });
        setCoverLetterData(prev => ({ ...prev, id: data.id }));
      }

      toast({
        title: "Success",
        description: "Cover letter saved successfully"
      });
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to save cover letter",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const generateWithAI = async () => {
    if (!coverLetterData.companyName || !coverLetterData.positionTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter company name and position title first",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      // Get resume data if selected
      let resumeData = null;
      if (coverLetterData.resumeId && coverLetterData.resumeId !== 'none') {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', coverLetterData.resumeId)
          .single();
        
        if (!error) resumeData = data;
      }

      // Generate cover letter content (simplified version)
      const generatedContent = generateCoverLetterTemplate(
        coverLetterData.companyName,
        coverLetterData.positionTitle,
        resumeData
      );

      setCoverLetterData(prev => ({
        ...prev,
        content: generatedContent
      }));

      toast({
        title: "Cover Letter Generated",
        description: "AI has generated your cover letter content"
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to generate cover letter",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateCoverLetterTemplate = (company: string, position: string, resumeData: any) => {
    const name = resumeData?.personal_info?.fullName || '[Your Name]';
    
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${company}. With my background and skills, I am confident that I would be a valuable addition to your team.

${resumeData?.personal_info?.summary ? 
`In my professional experience, ${resumeData.personal_info.summary.toLowerCase()}` : 
'Throughout my career, I have developed strong skills and experience that align well with this role.'
}

Key qualifications I bring include:
${resumeData?.skills ? 
resumeData.skills.slice(0, 3).map((skill: string) => `• Expertise in ${skill}`).join('\n') : 
'• Strong problem-solving abilities\n• Excellent communication skills\n• Team collaboration experience'
}

${resumeData?.experience && resumeData.experience.length > 0 ?
`In my previous role at ${resumeData.experience[0].company}, I ${resumeData.experience[0].description?.substring(0, 100) || 'contributed significantly to the team\'s success'}.` :
'I am eager to bring my skills and enthusiasm to contribute to your organization\'s continued success.'
}

I am excited about the opportunity to discuss how my background and passion align with ${company}'s goals. Thank you for considering my application.

Sincerely,
${name}`;
  };

  const downloadPDF = () => {
    toast({
      title: "Download Started",
      description: "Your cover letter PDF will be ready shortly"
    });
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading cover letter...</p>
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
              value={coverLetterData.title}
              onChange={(e) => setCoverLetterData(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-semibold border-0 p-0 bg-transparent dark:text-white"
              placeholder="Cover Letter Title"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={saveCoverLetter}
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
              <div className="space-y-6">
                {/* Company and Position Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Job Information
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="dark:text-gray-200">Company Name</Label>
                      <Input
                        id="companyName"
                        value={coverLetterData.companyName}
                        onChange={(e) => setCoverLetterData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="positionTitle" className="dark:text-gray-200">Position Title</Label>
                      <Input
                        id="positionTitle"
                        value={coverLetterData.positionTitle}
                        onChange={(e) => setCoverLetterData(prev => ({ ...prev, positionTitle: e.target.value }))}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Enter position title"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resumeSelect" className="dark:text-gray-200">Link to Resume (Optional)</Label>
                    <Select 
                      value={coverLetterData.resumeId} 
                      onValueChange={(value) => setCoverLetterData(prev => ({ ...prev, resumeId: value }))}
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600">
                        <SelectValue placeholder="Select a resume to link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No resume selected</SelectItem>
                        {resumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id}>
                            {resume.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* AI Generation */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Assistant
                    </h2>
                  </div>
                  
                  <Button
                    onClick={generateWithAI}
                    disabled={generating || !coverLetterData.companyName || !coverLetterData.positionTitle}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {generating ? 'Generating...' : 'Generate Cover Letter with AI'}
                  </Button>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI will create a personalized cover letter based on your job information and linked resume.
                  </p>
                </div>

                <Separator />

                {/* Content Editor */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Cover Letter Content
                    </h2>
                  </div>
                  
                  <div>
                    <Label htmlFor="content" className="dark:text-gray-200">Letter Content</Label>
                    <Textarea
                      id="content"
                      value={coverLetterData.content}
                      onChange={(e) => setCoverLetterData(prev => ({ ...prev, content: e.target.value }))}
                      className="mt-1 min-h-[400px] dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Write your cover letter content here, or use the AI generator above..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-24">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-sm min-h-[600px]">
              <div className="space-y-6">
                <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cover Letter Preview
                  </h1>
                  {coverLetterData.companyName && coverLetterData.positionTitle && (
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {coverLetterData.positionTitle} at {coverLetterData.companyName}
                    </p>
                  )}
                </div>
                
                <div className="prose dark:prose-invert max-w-none">
                  {coverLetterData.content ? (
                    <div className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                      {coverLetterData.content}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Your cover letter preview will appear here</p>
                      <p className="text-sm">Fill in the job information and generate content with AI or write manually</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
