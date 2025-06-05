
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Check, Eye, Search, Filter } from 'lucide-react';
import TemplatePreviewModal from './TemplatePreviewModal';

interface EnhancedTemplateSelectorProps {
  isOpen: boolean;
  selectedTemplate: number;
  onSelectTemplate: (template: number) => void;
  onClose: () => void;
}

const EnhancedTemplateSelector: React.FC<EnhancedTemplateSelectorProps> = ({
  isOpen,
  selectedTemplate,
  onSelectTemplate,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterATS, setFilterATS] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const templates = [
    {
      id: 0,
      name: "Modern Professional",
      category: "professional",
      description: "Clean and contemporary design perfect for corporate roles",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      atsScore: 95,
      features: ["ATS-Friendly", "Clean Layout", "Professional"],
      industry: ["Corporate", "Finance", "Consulting"],
      tags: ["clean", "corporate", "professional", "modern"]
    },
    {
      id: 1,
      name: "Executive Leadership",
      category: "executive", 
      description: "Sophisticated design for senior management positions",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      popular: false,
      atsScore: 92,
      features: ["Executive", "Elegant", "Leadership"],
      industry: ["Management", "Executive", "C-Level"],
      tags: ["executive", "leadership", "sophisticated", "senior"]
    },
    {
      id: 2,
      name: "Classic Corporate",
      category: "traditional",
      description: "Traditional layout with modern touches",
      color: "bg-gradient-to-br from-slate-600 to-slate-800",
      popular: false,
      atsScore: 98,
      features: ["Traditional", "Corporate", "Conservative"],
      industry: ["Banking", "Law", "Government"],
      tags: ["traditional", "conservative", "formal", "classic"]
    },
    {
      id: 3,
      name: "Creative Designer",
      category: "creative",
      description: "Eye-catching design for creative and design positions",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: true,
      atsScore: 78,
      features: ["Creative", "Colorful", "Stand Out"],
      industry: ["Design", "Marketing", "Advertising"],
      tags: ["creative", "colorful", "design", "artistic"]
    },
    {
      id: 4,
      name: "Tech Specialist",
      category: "technical",
      description: "Code-inspired layout perfect for developers and engineers",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      atsScore: 90,
      features: ["Tech-Focused", "Unique", "Developer-Friendly"],
      industry: ["Software", "Engineering", "IT"],
      tags: ["tech", "developer", "coding", "engineering"]
    },
    {
      id: 5,
      name: "Minimalist",
      category: "clean",
      description: "Clean, minimal design focusing on content",
      color: "bg-gradient-to-br from-gray-500 to-gray-700",
      popular: false,
      atsScore: 94,
      features: ["Minimal", "Clean", "Elegant"],
      industry: ["Any Industry", "Consulting", "Academia"],
      tags: ["minimal", "clean", "simple", "elegant"]
    },
    {
      id: 6,
      name: "Two Column",
      category: "structured",
      description: "Structured two-column layout for maximum efficiency",
      color: "bg-gradient-to-br from-indigo-600 to-purple-600",
      popular: false,
      atsScore: 88,
      features: ["Two-Column", "Structured", "Efficient"],
      industry: ["General", "Consulting", "Operations"],
      tags: ["structured", "organized", "efficient", "sidebar"]
    }
  ];

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    const matchesATS = filterATS === 'all' || 
                       (filterATS === 'excellent' && template.atsScore >= 90) ||
                       (filterATS === 'good' && template.atsScore >= 80 && template.atsScore < 90) ||
                       (filterATS === 'moderate' && template.atsScore < 80);
    
    return matchesSearch && matchesCategory && matchesATS;
  });

  const handleSelectTemplate = (templateId: number) => {
    onSelectTemplate(templateId);
  };

  const handlePreviewTemplate = (templateId: number) => {
    setPreviewTemplate(templateId);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' },
    { value: 'executive', label: 'Executive' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'clean', label: 'Minimal' },
    { value: 'structured', label: 'Structured' }
  ];

  const atsFilters = [
    { value: 'all', label: 'All ATS Scores' },
    { value: 'excellent', label: 'Excellent (90%+)' },
    { value: 'good', label: 'Good (80-89%)' },
    { value: 'moderate', label: 'Moderate (<80%)' }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Perfect Template</DialogTitle>
            <p className="text-gray-600 text-center">Select from {templates.length} professional templates designed for different industries and career levels</p>
          </DialogHeader>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterATS} onValueChange={setFilterATS}>
              <SelectTrigger>
                <SelectValue placeholder="ATS Score" />
              </SelectTrigger>
              <SelectContent>
                {atsFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Results Count */}
          <div className="text-sm text-gray-600 mt-4">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
          
          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Template Preview Content */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-3 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-6 h-6 bg-white/20 rounded mx-auto mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-0.5 bg-white/30 rounded w-8 mx-auto"></div>
                        <div className="h-0.5 bg-white/30 rounded w-6 mx-auto"></div>
                        <div className="h-0.5 bg-white/20 rounded w-5 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{template.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">{template.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.features.slice(0, 2).map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline"
                        className="text-xs px-1 py-0.5"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    <Button 
                      className={`flex-1 text-xs py-1 h-7 ${
                        selectedTemplate === template.id 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template.id);
                      }}
                    >
                      {selectedTemplate === template.id ? 'Selected' : 'Select'}
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="px-2 h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewTemplate(template.id);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or filters</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterATS('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              {selectedTemplate !== undefined ? `Template ${selectedTemplate + 1} selected` : 'No template selected'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {selectedTemplate !== undefined && (
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Use Selected Template
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Modal */}
      {previewTemplate !== null && (
        <TemplatePreviewModal
          isOpen={previewTemplate !== null}
          onClose={() => setPreviewTemplate(null)}
          templateId={previewTemplate}
          templateName={templates.find(t => t.id === previewTemplate)?.name || ''}
          onSelectTemplate={handleSelectTemplate}
          selectedTemplate={selectedTemplate}
        />
      )}
    </>
  );
};

export default EnhancedTemplateSelector;
