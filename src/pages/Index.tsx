
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Zap,
  FileText,
  Target,
  Sparkles,
  Globe,
  Briefcase,
  GraduationCap,
  Brain,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: "AI-Powered Builder",
      description: "Smart suggestions and auto-formatting to create professional resumes in minutes"
    },
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      title: "ATS Optimization",
      description: "Beat applicant tracking systems with optimized formatting and keywords"
    },
    {
      icon: <Eye className="w-6 h-6 text-purple-600" />,
      title: "Real-time Preview",
      description: "See your changes instantly with our live preview feature"
    },
    {
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      title: "Multiple Templates",
      description: "Choose from 20+ professional templates for different career levels"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      title: "Performance Analytics",
      description: "Track views, downloads, and optimize your resume performance"
    },
    {
      icon: <Globe className="w-6 h-6 text-teal-600" />,
      title: "Cover Letter Generator",
      description: "Create matching cover letters with AI-powered customization"
    }
  ];

  const templates = [
    {
      level: "Internship",
      title: "Clean Intern",
      description: "Perfect for students and fresh graduates",
      color: "bg-blue-100 text-blue-800",
      emphasis: "Education & Projects focused"
    },
    {
      level: "Junior",
      title: "Modern Junior",
      description: "Ideal for entry-level positions (0-2 years)",
      color: "bg-green-100 text-green-800",
      emphasis: "Skills & Projects showcase"
    },
    {
      level: "Mid-Level",
      title: "Professional",
      description: "For experienced professionals (3-7 years)",
      color: "bg-purple-100 text-purple-800",
      emphasis: "Experience & Achievements"
    },
    {
      level: "Senior",
      title: "Executive",
      description: "For senior roles and leadership positions",
      color: "bg-orange-100 text-orange-800",
      emphasis: "Leadership & Strategic impact"
    }
  ];

  const stats = [
    { number: "10K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "20+", label: "Templates" },
    { number: "5★", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ResumeAI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Features</a>
            <a href="#templates" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Templates</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Pricing</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            New: AI-Powered Cover Letter Generator
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build Your Perfect Resume with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Create ATS-optimized resumes and cover letters in minutes. Choose from level-specific templates,
            get AI suggestions, and track your application success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              {user ? 'Go to Dashboard' : 'Start Building Free'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/builder')}
              className="px-8 py-4 text-lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From AI-powered content suggestions to ATS optimization, we've got every aspect of your job search covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Templates for Every Career Level
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from professionally designed templates optimized for different experience levels and industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <Badge className={`${template.color} mb-3`}>
                    {template.level}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {template.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {template.description}
                  </p>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {template.emphasis}
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Preview Template
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've successfully landed their dream jobs using our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              {user ? 'Create New Resume' : 'Start Free Trial'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Sample
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ResumeAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Building the future of professional resumes with AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Resume Builder</a></li>
                <li><a href="#" className="hover:text-white">Cover Letters</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">ATS Scanner</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Career Guide</a></li>
                <li><a href="#" className="hover:text-white">Resume Examples</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
