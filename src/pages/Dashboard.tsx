import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  FileText, 
  Search, 
  MoreVertical, 
  Edit,
  Trash2,
  Download,
  Eye,
  Calendar,
  User,
  Moon,
  Sun,
  LogOut,
  Mail,
  Building,
  Briefcase,
  Clock,
  Zap,
  Target,
  Sparkles,
  Settings as SettingsIcon,
  Bell,
  BarChart3
} from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import NotificationsCenter from '@/components/NotificationsCenter';
import SettingsComponent from '@/components/Settings';
import JobMarket from '@/components/JobMarket';
import ResumeTrackingDashboard from '@/components/ResumeTrackingDashboard';

interface Resume {
  id: string;
  title: string;
  template_id: number;
  created_at: string;
  updated_at: string;
}

interface CoverLetter {
  id: string;
  title: string;
  company_name: string;
  position_title: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('resumes');
  const [currentView, setCurrentView] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('id, title, template_id, created_at, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (resumesError) {
        console.error('Error loading resumes:', resumesError);
      }

      // Load cover letters - using any type to bypass TypeScript issues until types are regenerated
      const { data: coverLettersData, error: coverLettersError } = await (supabase as any)
        .from('cover_letters')
        .select('id, title, company_name, position_title, created_at, updated_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (coverLettersError) {
        console.error('Error loading cover letters:', coverLettersError);
      }

      setResumes(resumesData || []);
      setCoverLetters(coverLettersData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user?.id,
          title: 'New Resume',
          personal_info: {},
          experience: [],
          education: [],
          skills: [],
          certifications: [],
          languages: [],
          interests: [],
          projects: []
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New resume created"
      });

      navigate(`/builder?id=${data.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast({
        title: "Error",
        description: "Failed to create resume",
        variant: "destructive"
      });
    }
  };

  const createNewCoverLetter = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('cover_letters')
        .insert([{
          user_id: user?.id,
          title: 'New Cover Letter',
          content: 'Your personalized cover letter content goes here...',
          company_name: '',
          position_title: ''
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New cover letter created"
      });

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

  const handleDeleteResume = async (resumeId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) throw error;

      setResumes(prev => prev.filter(r => r.id !== resumeId));
      toast({
        title: "Success",
        description: "Resume deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCoverLetter = async (coverLetterId: string) => {
    if (!user) return;
    
    try {
      const { error } = await (supabase as any)
        .from('cover_letters')
        .delete()
        .eq('id', coverLetterId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCoverLetters(prev => prev.filter(cl => cl.id !== coverLetterId));
      toast({
        title: "Success",
        description: "Cover letter deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      toast({
        title: "Error",
        description: "Failed to delete cover letter",
        variant: "destructive"
      });
    }
  };

  const previewResume = (resume: Resume) => {
    // Open preview in new tab/window
    window.open(`/builder?id=${resume.id}&preview=true`, '_blank');
  };

  const previewCoverLetter = (coverLetter: CoverLetter) => {
    // Open preview in new tab/window
    window.open(`/cover-letter-builder?id=${coverLetter.id}&preview=true`, '_blank');
  };

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCoverLetters = coverLetters.filter(cl =>
    cl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cl.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cl.position_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tracking':
        return <ResumeTrackingDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'settings':
        return <SettingsComponent />;
      case 'jobs':
        return <JobMarket />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <>
      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Create Resume
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Build professional resumes with AI
              </p>
            </div>
            <Button onClick={createNewResume} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Cover Letter
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Write compelling cover letters
              </p>
            </div>
            <Button onClick={createNewCoverLetter} className="bg-green-600 hover:bg-green-700">
              <Mail className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                CV Optimizer
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Optimize your CV with AI
              </p>
            </div>
            <Button onClick={() => navigate('/cv-optimizer')} className="bg-purple-600 hover:bg-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Templates
              </h3>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Browse premium templates
              </p>
            </div>
            <Button onClick={() => navigate('/templates')} className="bg-orange-600 hover:bg-orange-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Browse
            </Button>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Documents Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="resumes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Resumes ({resumes.length})
          </TabsTrigger>
          <TabsTrigger value="cover-letters" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Cover Letters ({coverLetters.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumes">
          {filteredResumes.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first resume to get started
              </p>
              <Button onClick={createNewResume}>
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{resume.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          Updated {new Date(resume.updated_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Template {resume.template_id + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/builder?id=${resume.id}`)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => previewResume(resume)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cover-letters">
          {filteredCoverLetters.length === 0 ? (
            <Card className="p-12 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No cover letters yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first cover letter to get started
              </p>
              <Button onClick={createNewCoverLetter}>
                <Plus className="w-4 h-4 mr-2" />
                Create Cover Letter
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoverLetters.map((coverLetter) => (
                <Card key={coverLetter.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{coverLetter.title}</CardTitle>
                        <CardDescription className="space-y-1">
                          {coverLetter.company_name && (
                            <div className="flex items-center gap-2">
                              <Building className="h-3 w-3" />
                              {coverLetter.company_name}
                            </div>
                          )}
                          {coverLetter.position_title && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-3 w-3" />
                              {coverLetter.position_title}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Updated {new Date(coverLetter.updated_at).toLocaleDateString()}
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/cover-letter-builder?id=${coverLetter.id}`)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => previewCoverLetter(coverLetter)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCoverLetter(coverLetter.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="p-8 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your workspace...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Resume Builder Pro
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Career Tools</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: Briefcase },
                  { id: 'tracking', label: 'Tracking', icon: BarChart3 },
                  { id: 'jobs', label: 'Jobs', icon: Search },
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'settings', label: 'Settings', icon: SettingsIcon }
                ].map(({ id, label, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={currentView === id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView(id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Pro
              </Badge>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Briefcase },
            { id: 'tracking', label: 'Tracking', icon: BarChart3 },
            { id: 'jobs', label: 'Jobs', icon: Search },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'settings', label: 'Settings', icon: SettingsIcon }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentView === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView(id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Dashboard;
