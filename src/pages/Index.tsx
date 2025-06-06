
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  Zap, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Optimization",
      description: "Let our AI optimize your resume for ATS systems and specific job requirements."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Professional Templates",
      description: "Choose from 16+ professionally designed templates that get you noticed."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Job Market Scanner",
      description: "Automatically scan job markets and get insights on trending requirements."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ATS Compatibility",
      description: "Ensure your resume passes through Applicant Tracking Systems with 95% success rate."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Cover Letter Builder",
      description: "Create compelling cover letters with multiple templates and AI assistance."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track your application success rate and get insights to improve your chances."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Resumes Created" },
    { number: "85%", label: "Interview Success Rate" },
    { number: "16+", label: "Professional Templates" },
    { number: "95%", label: "ATS Compatibility" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      quote: "This resume builder helped me land my dream job at a Fortune 500 company. The ATS optimization was a game-changer!"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager", 
      company: "StartupXYZ",
      quote: "The AI-powered suggestions and professional templates made my resume stand out. Highly recommended!"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Analytics Pro",
      quote: "The job market scanner feature helped me understand what skills were in demand. Got 3 interviews in one week!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResumeBuilder Pro
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              Reviews
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            ✨ AI-Powered Resume Builder
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Build Resumes That
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Get Hired</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes with our AI-powered builder. 
            Stand out from the crowd and land your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Templates
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you create, optimize, and track your job applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our users have to say about their success stories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful job seekers who've landed their dream jobs using our platform.
          </p>
          
          {user ? (
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ResumeBuilder Pro</span>
              </div>
              <p className="text-gray-400">
                The most advanced AI-powered resume builder to help you land your dream job.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeBuilder Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
