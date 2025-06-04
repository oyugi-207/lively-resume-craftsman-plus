
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Star } from 'lucide-react';

interface CoverLetterTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  tone: string;
  color: string;
  popular: boolean;
  preview: string;
  industry: string[];
}

interface CoverLetterTemplatesProps {
  onSelectTemplate: (templateId: number) => void;
  selectedTemplate?: number;
}

const CoverLetterTemplates: React.FC<CoverLetterTemplatesProps> = ({
  onSelectTemplate,
  selectedTemplate = 0
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const templates: CoverLetterTemplate[] = [
    {
      id: 0,
      name: "Professional Standard",
      category: "professional",
      description: "Classic professional tone perfect for corporate roles",
      tone: "Formal & Professional",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      popular: true,
      preview: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Position] role at [Company]. With [X years] of experience in [Industry], I am confident that my skills and passion make me an ideal candidate...",
      industry: ["Corporate", "Finance", "Healthcare", "Legal"]
    },
    {
      id: 1,
      name: "Creative & Modern",
      category: "creative",
      description: "Engaging and creative tone for design and marketing roles",
      tone: "Creative & Engaging",
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      popular: true,
      preview: "Hello [Hiring Manager],\n\nYour [Position] opportunity caught my attention immediately - it's exactly the kind of challenge I've been seeking! As a passionate [Your Role] with a track record of [Achievement]...",
      industry: ["Design", "Marketing", "Advertising", "Media"]
    },
    {
      id: 2,
      name: "Tech Specialist",
      category: "tech",
      description: "Technical yet personable tone for technology roles",
      tone: "Technical & Clear",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
      popular: true,
      preview: "Dear [Hiring Manager],\n\nI'm excited to apply for the [Position] role at [Company]. Having worked with [Technologies/Skills] and delivered [Specific Achievement], I'm eager to contribute to your team's success...",
      industry: ["Software", "Engineering", "IT", "Data Science"]
    },
    {
      id: 3,
      name: "Executive Leadership",
      category: "executive",
      description: "Authoritative and strategic tone for senior positions",
      tone: "Strategic & Authoritative",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      popular: false,
      preview: "Dear Board Members / Executive Team,\n\nI am pleased to submit my candidacy for the [Position] role. Throughout my [X years] of executive leadership, I have consistently delivered [Key Results]...",
      industry: ["C-Level", "Executive", "Management", "Strategy"]
    },
    {
      id: 4,
      name: "Academic Research",
      category: "academic",
      description: "Scholarly and detailed tone for academic positions",
      tone: "Scholarly & Detailed",
      color: "bg-gradient-to-br from-amber-600 to-yellow-600",
      popular: false,
      preview: "Dear Search Committee,\n\nI write to express my interest in the [Position] at [Institution]. My research in [Field] and publications in [Journals] align closely with your department's mission...",
      industry: ["Academia", "Research", "Education", "Science"]
    },
    {
      id: 5,
      name: "Sales & Business",
      category: "sales",
      description: "Results-driven tone highlighting achievements",
      tone: "Results-Driven & Confident",
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      popular: false,
      preview: "Dear Sales Manager,\n\nI'm thrilled to apply for the [Position] role. In my previous role, I exceeded targets by [Percentage] and generated $[Amount] in new revenue...",
      industry: ["Sales", "Business Development", "Account Management"]
    },
    {
      id: 6,
      name: "Healthcare Professional",
      category: "healthcare",
      description: "Compassionate and professional tone for medical roles",
      tone: "Compassionate & Professional",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      popular: false,
      preview: "Dear Hiring Manager,\n\nI am writing to apply for the [Position] role at [Healthcare Facility]. My commitment to patient care and [X years] of experience in [Specialty]...",
      industry: ["Healthcare", "Medical", "Nursing", "Therapy"]
    },
    {
      id: 7,
      name: "Startup & Innovation",
      category: "startup",
      description: "Dynamic and entrepreneurial tone for startup roles",
      tone: "Dynamic & Entrepreneurial",
      color: "bg-gradient-to-br from-rose-500 to-pink-600",
      popular: false,
      preview: "Hi [Hiring Manager],\n\nI'm excited about the opportunity to join [Startup] as [Position]. Having thrived in fast-paced environments and launched [Achievement]...",
      industry: ["Startups", "Innovation", "Entrepreneurship", "Venture"]
    }
  ];

  const handlePreview = (templateId: number) => {
    setPreviewTemplate(previewTemplate === templateId ? null : templateId);
  };

  const handleSelect = (templateId: number) => {
    onSelectTemplate(templateId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cover Letter Templates
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from {templates.length} professional cover letter templates tailored to different industries and tones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            {/* Template Header */}
            <div className={`h-24 ${template.color} relative`}>
              {template.popular && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500 text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Popular
                </Badge>
              )}
              
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm m-3 rounded flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm font-semibold">{template.name}</div>
                  <div className="text-xs opacity-80">{template.tone}</div>
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {template.name}
                {selectedTemplate === template.id && (
                  <Badge className="bg-blue-500 text-white">Selected</Badge>
                )}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tone Badge */}
              <Badge variant="outline" className="text-xs">
                {template.tone}
              </Badge>

              {/* Industry Tags */}
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Best for:</span>{' '}
                {template.industry.join(', ')}
              </div>

              {/* Preview Text */}
              {previewTemplate === template.id && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs">
                  <div className="font-medium mb-2">Preview:</div>
                  <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line line-clamp-4">
                    {template.preview}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template.id)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {previewTemplate === template.id ? 'Hide' : 'Preview'}
                </Button>
                <Button
                  onClick={() => handleSelect(template.id)}
                  className={`flex-1 ${
                    selectedTemplate === template.id
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoverLetterTemplates;
