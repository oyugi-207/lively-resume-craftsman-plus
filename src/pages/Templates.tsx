
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Download, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImprovedResumePreview from '@/components/ImprovedResumePreview';
import TemplatePreviewModal from '@/components/TemplatePreviewModal';

const Templates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  // Sample resume data for previews
  const sampleData = {
    personal: {
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      summary: "Experienced software engineer with 5+ years of expertise in full-stack development."
    },
    experience: [
      {
        id: 1,
        company: "Tech Solutions Inc.",
        position: "Senior Software Engineer",
        location: "New York, NY",
        startDate: "Jan 2022",
        endDate: "Present",
        description: "Led development of microservices architecture serving 1M+ users."
      },
      {
        id: 2,
        company: "StartupCorp",
        position: "Full Stack Developer",
        location: "San Francisco, CA",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        description: "Built React-based web applications with Node.js backends."
      }
    ],
    education: [
      {
        id: 1,
        school: "Stanford University",
        degree: "Bachelor of Science in Computer Science",
        location: "Stanford, CA",
        startDate: "2016",
        endDate: "2020",
        gpa: "3.8"
      }
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS"],
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce solution with React and Node.js.",
        technologies: "React, Node.js, MongoDB",
        link: "github.com/johnsmith/ecommerce",
        startDate: "Mar 2023",
        endDate: "Jun 2023"
      }
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
        credentialId: "AWS-SA-12345"
      }
    ],
    languages: [
      {
        id: 1,
        language: "English",
        proficiency: "Native"
      },
      {
        id: 2,
        language: "Spanish",
        proficiency: "Conversational"
      }
    ],
    interests: ["Open Source", "Photography", "Travel"]
  };

  const templates = [
    {
      id: 0,
      name: "Modern Professional",
      description: "Clean and contemporary design perfect for corporate roles",
      category: "Professional",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      atsScore: 95,
      features: ["ATS-Friendly", "Clean Layout", "Professional"],
      industry: ["Corporate", "Finance", "Consulting"]
    },
    {
      id: 1,
      name: "Executive Leadership",
      description: "Sophisticated design for senior management positions",
      category: "Executive",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      popular: false,
      atsScore: 92,
      features: ["Executive", "Elegant", "Leadership"],
      industry: ["Management", "Executive", "C-Level"]
    },
    {
      id: 2,
      name: "Classic Corporate",
      description: "Traditional layout with modern touches",
      category: "Traditional",
      color: "bg-gradient-to-br from-slate-600 to-slate-800",
      popular: false,
      atsScore: 98,
      features: ["Traditional", "Corporate", "Conservative"],
      industry: ["Banking", "Law", "Government"]
    },
    {
      id: 3,
      name: "Creative Designer",
      description: "Eye-catching design for creative professionals",
      category: "Creative",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: true,
      atsScore: 78,
      features: ["Creative", "Colorful", "Portfolio"],
      industry: ["Design", "Marketing", "Advertising"]
    },
    {
      id: 4,
      name: "Tech Specialist",
      description: "Code-inspired layout for developers and engineers",
      category: "Technical",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      atsScore: 90,
      features: ["Tech-Focused", "Skills-Heavy", "Modern"],
      industry: ["Software", "Engineering", "IT"]
    },
    {
      id: 5,
      name: "Minimalist",
      description: "Clean, minimal design focusing on content",
      category: "Clean",
      color: "bg-gradient-to-br from-gray-500 to-gray-700",
      popular: false,
      atsScore: 94,
      features: ["Minimal", "Content-Focus", "Elegant"],
      industry: ["Any Industry", "Academia", "Research"]
    },
    {
      id: 6,
      name: "Two Column",
      description: "Structured layout maximizing space efficiency",
      category: "Structured",
      color: "bg-gradient-to-br from-indigo-600 to-purple-600",
      popular: false,
      atsScore: 88,
      features: ["Two-Column", "Space-Efficient", "Organized"],
      industry: ["General", "Consulting", "Operations"]
    }
  ];

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleUseTemplate = (templateId: number) => {
    navigate(`/builder?template=${templateId}`);
  };

  const handlePreviewTemplate = (templateId: number) => {
    setPreviewTemplate(templateId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Resume Templates
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose from {templates.length} professional templates designed for success
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/builder')}>
              Start Building
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Template Preview */}
              <div className={`h-64 ${template.color} relative`}>
                {template.popular && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
                
                <Badge 
                  className={`absolute top-4 left-4 ${getATSScoreColor(template.atsScore)}`}
                >
                  ATS: {template.atsScore}%
                </Badge>
                
                {/* Live Template Preview */}
                <div className="absolute inset-4 bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="transform scale-[0.15] origin-top-left w-[600px] h-[800px]">
                    <ImprovedResumePreview 
                      data={sampleData} 
                      template={template.id}
                      scale={1}
                    />
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {template.name}
                  <Badge variant="outline">{template.category}</Badge>
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="secondary"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Industry Tags */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Best for:</span>{' '}
                  {template.industry.join(', ')}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handlePreviewTemplate(template.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Create Your Professional Resume?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Choose any template above and start building your resume in minutes
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/builder')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Building Now
            </Button>
          </Card>
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate !== null && (
        <TemplatePreviewModal
          isOpen={true}
          onClose={() => setPreviewTemplate(null)}
          templateId={previewTemplate}
          templateName={templates.find(t => t.id === previewTemplate)?.name || ''}
          onSelectTemplate={handleUseTemplate}
          selectedTemplate={selectedTemplate}
        />
      )}
    </div>
  );
};

export default Templates;
