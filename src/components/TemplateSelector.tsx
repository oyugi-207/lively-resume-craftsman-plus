
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
    {
      id: 0,
      name: "Modern Professional",
      description: "Clean and contemporary design perfect for corporate roles",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      features: ["ATS-Friendly", "Clean Layout", "Professional"]
    },
    {
      id: 1,
      name: "Creative Designer",
      description: "Eye-catching design for creative and design positions",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: false,
      features: ["Creative", "Colorful", "Stand Out"]
    },
    {
      id: 2,
      name: "Tech Specialist",
      description: "Code-inspired layout perfect for developers and engineers",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      features: ["Tech-Focused", "Unique", "Developer-Friendly"]
    },
    {
      id: 3,
      name: "Executive Leader",
      description: "Sophisticated design for senior management positions",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      popular: false,
      features: ["Executive", "Elegant", "Leadership"]
    }
  ];

  const handleSelectTemplate = (templateId: number) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Template</DialogTitle>
          <p className="text-gray-600 text-center">Select a template that best fits your industry and style</p>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Template Preview */}
              <div className={`h-48 ${template.color} relative`}>
                {template.popular && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 left-3 bg-blue-500 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                {/* Template Preview Content */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-4 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white/30 rounded w-24 mx-auto"></div>
                      <div className="h-2 bg-white/30 rounded w-20 mx-auto"></div>
                      <div className="h-1 bg-white/20 rounded w-16 mx-auto"></div>
                      <div className="h-1 bg-white/20 rounded w-18 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Button 
                  className={`w-full ${
                    selectedTemplate === template.id 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use This Template'}
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
