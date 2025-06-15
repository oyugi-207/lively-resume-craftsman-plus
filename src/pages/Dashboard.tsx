
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Calendar,
  User,
  Brain,
  Sparkles,
  Zap,
  Crown,
  BarChart3,
  Settings,
  Upload,
  Wand2
} from 'lucide-react';
import CVUploadEditor from '@/components/CVUploadEditor';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import UserProfile from '@/components/UserProfile';
import Settings from '@/components/Settings';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('resumes');
  const [showCVEditor, setShowCVEditor] = useState(false);

  useEffect(() => {
    if (user) {
      loadResumes();
    }
  }, [user]);

  const loadResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error: any) {
      console.error('Error loading resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setResumes(resumes.filter(resume => resume.id !== id));
      toast.success('Resume deleted successfully');
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'resumes':
        return (
          <div className="space-y-6">
            {/* AI CV Editor Section */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      AI-Powered CV Editor
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                      Next-gen CV extraction, enhancement, and optimization with Gemini AI
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white ml-auto">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Smart Upload</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">AI extracts data from any CV format</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <Wand2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">AI Enhancement</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Automatically improves content quality</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">ATS Optimized</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Optimized for job application systems</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCVEditor(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  size="lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Open AI CV Editor
                </Button>
              </CardContent>
            </Card>

            {/* Resume Management Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Resumes
                </CardTitle>
                <Button
                  onClick={() => navigate('/builder')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Resume
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-24 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Create your first resume or use our AI-powered CV editor to get started
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/builder')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Resume
                      </Button>
                      <Button 
                        onClick={() => setShowCVEditor(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Use AI Editor
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                      <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {resume.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Template {(resume.template_id || 0) + 1}
                                </Badge>
                                {resume.job_description && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    ATS Optimized
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                            <Calendar className="w-3 h-3" />
                            <span>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/builder?id=${resume.id}`)}
                              className="flex-1"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteResume(resume.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-xl">
          <CardTitle className="mb-4 text-2xl">Authentication Required</CardTitle>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-lg p-1 border border-white/20">
            {[
              { id: 'resumes', label: 'Resumes', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>

      {/* AI CV Editor Modal */}
      {showCVEditor && (
        <CVUploadEditor onClose={() => setShowCVEditor(false)} />
      )}
    </div>
  );
};

export default Dashboard;
