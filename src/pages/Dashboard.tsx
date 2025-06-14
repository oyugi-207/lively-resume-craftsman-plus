
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  PlusCircle, 
  BarChart3, 
  Target, 
  Clock,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Eye,
  Edit,
  Settings,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Brain,
  Upload,
  Bot,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ResumeBuilder from '@/components/ResumeBuilder';
import ATSAnalyzer from '@/components/ATSAnalyzer';
import CVUploadEditor from '@/components/CVUploadEditor';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [mockResumeData, setMockResumeData] = useState({
    personal: {
      fullName: user?.user_metadata?.full_name || 'Your Name',
      email: user?.email || '',
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

  const stats = [
    { 
      title: 'Total Resumes', 
      value: '3', 
      change: '+2 this month',
      icon: FileText,
      color: 'text-blue-600'
    },
    { 
      title: 'Applications Sent', 
      value: '12', 
      change: '+4 this week',
      icon: Target,
      color: 'text-green-600'
    },
    { 
      title: 'ATS Score Avg', 
      value: '87%', 
      change: '+5% improved',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    { 
      title: 'Response Rate', 
      value: '23%', 
      change: '+8% vs last month',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Resume',
      description: 'Start building a new professional resume',
      icon: PlusCircle,
      action: () => setActiveView('builder'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Upload & Edit CV',
      description: 'Upload existing CV and enhance with AI',
      icon: Upload,
      action: () => setActiveView('cv-editor'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'ATS Checker',
      description: 'Analyze resume for ATS compatibility',
      icon: Target,
      action: () => setActiveView('ats-checker'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'AI Enhancement',
      description: 'Improve your resume with AI suggestions',
      icon: Brain,
      action: () => setActiveView('ai-enhance'),
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const recentActivity = [
    { action: 'Created', item: 'Software Engineer Resume', time: '2 hours ago', status: 'completed' },
    { action: 'Downloaded', item: 'Marketing Manager CV', time: '1 day ago', status: 'completed' },
    { action: 'ATS Check', item: 'Product Manager Resume', time: '2 days ago', status: 'completed' },
    { action: 'Applied to', item: 'Senior Developer at TechCorp', time: '3 days ago', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Professional'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's create amazing resumes and land your dream job
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'builder', label: 'Resume Builder', icon: Edit },
                { key: 'cv-editor', label: 'CV Editor', icon: Upload },
                { key: 'ats-checker', label: 'ATS Checker', icon: Target },
                { key: 'templates', label: 'Templates', icon: FileText }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeView === key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {stat.change}
                        </p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      className={`h-auto p-6 flex flex-col items-start gap-3 ${action.color} text-white`}
                    >
                      <action.icon className="w-8 h-8" />
                      <div className="text-left">
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action} <span className="text-blue-600 dark:text-blue-400">{activity.item}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    This Week's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Resume Creation</span>
                      <span className="text-sm font-medium">2/3 Goals</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Job Applications</span>
                      <span className="text-sm font-medium">4/5 Goals</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">ATS Optimization</span>
                      <span className="text-sm font-medium">1/2 Goals</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'builder' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Resume Builder</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create a professional resume from scratch
              </p>
            </div>
            <ResumeBuilder 
              initialData={mockResumeData} 
              onSave={(data) => {
                setMockResumeData(data);
                console.log('Resume saved:', data);
              }} 
            />
          </div>
        )}

        {activeView === 'cv-editor' && <CVUploadEditor />}

        {activeView === 'ats-checker' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ATS Compatibility Checker</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Analyze your resume for Applicant Tracking System compatibility
              </p>
            </div>
            <ATSAnalyzer 
              resumeData={mockResumeData}
              jobDescription=""
              onOptimizationApplied={(data) => setMockResumeData(data)}
            />
          </div>
        )}

        {activeView === 'templates' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Resume Templates</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from our collection of professional templates
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8 mb-4 h-48 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Template {i + 1}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Professional template perfect for {['tech roles', 'executive positions', 'creative fields', 'academic positions', 'sales roles', 'consulting'][i]}
                    </p>
                    <Button className="w-full" onClick={() => setActiveView('builder')}>
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
