
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Zap, Download, Palette, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Optimization",
      description: "Automatically tailor your resume for specific job descriptions with smart suggestions."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Premium Templates",
      description: "Choose from professionally designed, ATS-friendly templates that stand out."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Instant Export",
      description: "Generate and download professional PDFs in seconds, ready for applications."
    }
  ];

  const templates = [
    { name: "Modern Professional", color: "bg-gradient-to-br from-blue-600 to-blue-800", popular: true },
    { name: "Creative Designer", color: "bg-gradient-to-br from-purple-600 to-pink-600", popular: false },
    { name: "Tech Specialist", color: "bg-gradient-to-br from-green-600 to-teal-600", popular: true },
    { name: "Executive Leader", color: "bg-gradient-to-br from-gray-700 to-gray-900", popular: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ResumeAI Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Templates</Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Examples</Button>
            <Button 
              onClick={() => navigate('/builder')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6"
            >
              Create Resume
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Stunning
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Resumes </span>
            in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Build professional, ATS-friendly resumes tailored to any job description. 
            Stand out from the crowd with our AI-powered optimization and premium templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/builder')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 text-lg h-auto"
            >
              Start Building Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg h-auto">
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make resume creation effortless and effective
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Templates for Every Industry
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our curated collection of ATS-friendly, professionally designed templates
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm">
              <div className={`h-48 ${template.color} relative`}>
                {template.popular && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </div>
                )}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-4 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-2 bg-white/30 rounded w-20 mx-auto"></div>
                      <div className="h-2 bg-white/30 rounded w-16 mx-auto"></div>
                      <div className="h-2 bg-white/30 rounded w-12 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <Button 
                  onClick={() => navigate(`/builder?template=${index}`)}
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have landed their dream jobs with ResumeAI Pro
          </p>
          <Button 
            onClick={() => navigate('/builder')}
            className="bg-white text-blue-600 hover:bg-gray-50 font-medium px-8 py-3 text-lg h-auto"
          >
            Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold">ResumeAI Pro</span>
            </div>
            <p className="text-gray-400">© 2024 ResumeAI Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
