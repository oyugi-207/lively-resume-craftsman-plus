
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap, Target, Download, Users, Star, CheckCircle, ArrowRight, Moon, Sun, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Content",
      description: "Generate compelling resume content with advanced AI assistance"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from 6+ professionally designed templates"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "ResumeAI Pro helped me land my dream job at a top tech company. The ATS optimization was game-changing!"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      content: "The AI-powered content suggestions saved me hours of writing. Highly recommended!"
    },
    {
      name: "Emily Rodriguez",
      role: "Product Designer",
      content: "Beautiful templates and seamless user experience. Got multiple interview calls!"
    }
  ];

  const benefits = [
    "Professional resume templates",
    "AI-powered content generation",
    "ATS optimization tools",
    "Real-time preview",
    "Multiple export formats",
    "Job description analysis"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">ResumeAI Pro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth">
                    <Button variant="ghost" className="text-gray-700 dark:text-gray-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            ✨ AI-Powered Resume Builder
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Create Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Professional Resume
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Build ATS-optimized resumes with AI assistance, professional templates, and real-time optimization. 
            Land your dream job faster with ResumeAI Pro.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2">
                View Templates
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">95%</div>
              <div className="text-gray-600 dark:text-gray-300">ATS Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.9/5</div>
              <div className="text-gray-600 dark:text-gray-300">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Perfect Resumes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create a professional, ATS-optimized resume that gets results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose ResumeAI Pro?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our platform combines cutting-edge AI technology with professional design to help you create resumes that stand out and get noticed by employers.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
                  <p className="mb-6 opacity-90">Join thousands of professionals who've landed their dream jobs</p>
                  <Link to="/auth">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Create Your Resume
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <div className="flex justify-center items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-300">(4.9/5 from 2,000+ reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who've successfully created winning resumes with ResumeAI Pro
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">ResumeAI Pro</span>
              </div>
              <p className="text-gray-400 mb-4">
                Create professional, ATS-optimized resumes with AI assistance and land your dream job faster.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                <li><Link to="/builder" className="hover:text-white transition-colors">Resume Builder</Link></li>
                <li><Link to="/cv-optimizer" className="hover:text-white transition-colors">ATS Optimizer</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
