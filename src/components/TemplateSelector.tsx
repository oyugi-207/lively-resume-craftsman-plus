
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (template: number) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
  onClose
}) => {
  const templates = [
    // Professional Templates
    {
      id: 0,
      name: "Modern Professional",
      category: "professional",
      description: "Clean and contemporary design perfect for corporate roles",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      atsScore: 95,
      features: ["ATS-Friendly", "Clean Layout", "Professional"],
      industry: ["Corporate", "Finance", "Consulting"]
    },
    {
      id: 1,
      name: "Executive Leader",
      category: "professional",
      description: "Sophisticated design for senior management positions",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      popular: false,
      atsScore: 92,
      features: ["Executive", "Elegant", "Leadership"],
      industry: ["Management", "Executive", "C-Level"]
    },
    {
      id: 2,
      name: "Classic Corporate",
      category: "professional",
      description: "Traditional layout with modern touches",
      color: "bg-gradient-to-br from-slate-600 to-slate-800",
      popular: false,
      atsScore: 98,
      features: ["Traditional", "Corporate", "Conservative"],
      industry: ["Banking", "Law", "Government"]
    },
    
    // Creative Templates
    {
      id: 3,
      name: "Creative Designer",
      category: "creative",
      description: "Eye-catching design for creative and design positions",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: true,
      atsScore: 78,
      features: ["Creative", "Colorful", "Stand Out"],
      industry: ["Design", "Marketing", "Advertising"]
    },
    {
      id: 4,
      name: "Artistic Portfolio",
      category: "creative",
      description: "Visual-heavy template for showcasing creative work",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      popular: false,
      atsScore: 72,
      features: ["Portfolio", "Visual", "Creative"],
      industry: ["Art", "Photography", "Design"]
    },
    {
      id: 5,
      name: "Modern Creative",
      category: "creative",
      description: "Balanced creativity with professionalism",
      color: "bg-gradient-to-br from-teal-500 to-cyan-600",
      popular: false,
      atsScore: 85,
      features: ["Modern", "Balanced", "Creative"],
      industry: ["UX/UI", "Branding", "Digital"]
    },

    // Tech Templates
    {
      id: 6,
      name: "Tech Specialist",
      category: "tech",
      description: "Code-inspired layout perfect for developers and engineers",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      atsScore: 90,
      features: ["Tech-Focused", "Unique", "Developer-Friendly"],
      industry: ["Software", "Engineering", "IT"]
    },
    {
      id: 7,
      name: "Full Stack Developer",
      category: "tech",
      description: "Multi-section layout for showcasing technical skills",
      color: "bg-gradient-to-br from-indigo-600 to-purple-600",
      popular: false,
      atsScore: 88,
      features: ["Multi-Column", "Technical", "Skills-Focused"],
      industry: ["Development", "Programming", "Tech"]
    },
    {
      id: 8,
      name: "DevOps Engineer",
      category: "tech",
      description: "Infrastructure-focused design for DevOps professionals",
      color: "bg-gradient-to-br from-emerald-600 to-green-700",
      popular: false,
      atsScore: 86,
      features: ["Infrastructure", "Technical", "Systems"],
      industry: ["DevOps", "Cloud", "Infrastructure"]
    },

    // Academic Templates
    {
      id: 9,
      name: "Research Academic",
      category: "academic",
      description: "Publication-focused layout for researchers",
      color: "bg-gradient-to-br from-amber-600 to-yellow-600",
      popular: false,
      atsScore: 94,
      features: ["Research-Focused", "Publications", "Academic"],
      industry: ["Research", "Academia", "Science"]
    },
    {
      id: 10,
      name: "PhD Candidate",
      category: "academic",
      description: "Balanced education and research experience",
      color: "bg-gradient-to-br from-violet-600 to-purple-700",
      popular: false,
      atsScore: 91,
      features: ["Education-Focused", "Research", "Graduate"],
      industry: ["Academia", "PhD", "Research"]
    }
  ];

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
  };

  const handleSelectTemplate = (templateId: number) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Template</DialogTitle>
          <p className="text-gray-600 text-center">Select a template that best fits your industry and style</p>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Template Preview */}
              <div className={`h-32 ${template.color} relative`}>
                {template.popular && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500 text-xs">
                    <Star className="w-2 h-2 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
                
                <Badge 
                  className={`absolute top-2 left-2 text-xs ${getATSScoreColor(template.atsScore)}`}
                >
                  ATS: {template.atsScore}%
                </Badge>
                
                {selectedTemplate === template.id && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                {/* Template Preview Content */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-3 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-8 h-8 bg-white/20 rounded mx-auto mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-white/30 rounded w-12 mx-auto"></div>
                      <div className="h-1 bg-white/30 rounded w-10 mx-auto"></div>
                      <div className="h-0.5 bg-white/20 rounded w-8 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{template.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{template.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {template.features.slice(0, 2).map((feature) => (
                    <span 
                      key={feature} 
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1 py-0.5 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Button 
                  className={`w-full text-xs py-1 h-7 ${
                    selectedTemplate === template.id 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onClose} className="px-8">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;
