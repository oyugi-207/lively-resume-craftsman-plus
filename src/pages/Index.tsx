
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Zap, 
  Download, 
  Shield, 
  Moon, 
  Sun, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered",
      description: "Smart suggestions and optimization for better results"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "ATS-Friendly",
      description: "Designed to pass Applicant Tracking Systems"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Multiple Formats",
      description: "Export to PDF, Word, and other popular formats"
    }
  ];

  const templates = [
    { name: "Modern Professional", color: "bg-blue-500", popular: true },
    { name: "Creative Designer", color: "bg-purple-500", popular: false },
    { name: "Tech Specialist", color: "bg-green-500", popular: true },
    { name: "Executive Leader", color: "bg-gray-700", popular: false }
  ];

  const stats = [
    { number: "50K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ResumeAI Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              {user ? (
                <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Star className="h-3 w-3 mr-1" />
            #1 Resume Builder
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Create Stunning
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Professional{" "}
            </span>
            Resumes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Build professional, ATS-friendly resumes tailored to any job description with 
            AI-powered optimization. Get hired faster with our modern templates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              {user ? 'Go to Dashboard' : 'Start Building Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 dark:border-gray-600">
              View Templates
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ResumeAI Pro?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create professional resumes that get you hired
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <CardTitle className="dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="dark:text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose from our collection of ATS-friendly templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardHeader>
                  <div className={`h-32 ${template.color} rounded-lg mb-4 relative overflow-hidden`}>
                    {template.popular && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                        Popular
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-2 rounded flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-2"></div>
                        <div className="space-y-1">
                          <div className="h-1 bg-white/30 rounded w-12 mx-auto"></div>
                          <div className="h-1 bg-white/30 rounded w-10 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg dark:text-white">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate(user ? '/dashboard' : '/auth')}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your Dream Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who landed their dream jobs with ResumeAI Pro
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            {user ? 'Go to Dashboard' : 'Get Started for Free'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">ResumeAI Pro</span>
          </div>
          <p className="text-gray-400">
            Create professional resumes that get you hired. Fast, easy, and effective.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
