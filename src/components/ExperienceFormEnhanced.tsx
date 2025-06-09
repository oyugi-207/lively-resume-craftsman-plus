
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import { useAPIKey } from '@/hooks/useAPIKey';
import { supabase } from '@/integrations/supabase/client';

interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceFormEnhancedProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const ExperienceFormEnhanced: React.FC<ExperienceFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-format description with bullet points if it's the description field
    if (field === 'description') {
      updated[index].description = formatWithBullets(value);
    }
    
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const formatWithBullets = (text: string): string => {
    if (!text) return '';
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    return lines.map(line => {
      // If line doesn't start with bullet point, add one
      if (!line.match(/^[•·‣▪▫-]\s/)) {
        return `• ${line}`;
      }
      return line;
    }).join('\n');
  };

  const optimizeWithAI = async (index: number) => {
    const experience = data[index];
    if (!experience.position || !experience.company) {
      toast.error('Please add position and company first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    setOptimizingIndex(index);
    try {
      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: {
          experienceData: experience,
          type: 'experience',
          apiKey
        }
      });

      if (error) throw error;

      if (result?.optimizedDescription) {
        const formattedDescription = formatWithBullets(result.optimizedDescription);
        updateExperience(index, 'description', formattedDescription);
        toast.success('Experience optimized with AI!');
      }
    } catch (error) {
      console.error('AI optimization error:', error);
      toast.error('Failed to optimize experience. Please check your API key.');
    } finally {
      setOptimizingIndex(null);
    }
  };

  const generateBulletPoints = (index: number) => {
    const experience = data[index];
    if (!experience.description) {
      // Add sample bullet points
      const sampleBullets = [
        '• Achieved significant results in key performance areas',
        '• Collaborated with cross-functional teams to deliver projects',
        '• Implemented process improvements that increased efficiency',
        '• Managed stakeholder relationships and communication'
      ];
      updateExperience(index, 'description', sampleBullets.join('\n'));
    } else {
      // Format existing text with bullet points
      updateExperience(index, 'description', experience.description);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {data.map((experience, index) => (
        <Card key={experience.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Experience {index + 1}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateBulletPoints(index)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  Bullets
                </Button>
                <Button
                  onClick={() => optimizeWithAI(index)}
                  disabled={optimizingIndex === index}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  {optimizingIndex === index ? (
                    <Wand2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  AI
                </Button>
                <Button
                  onClick={() => removeExperience(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`position-${index}`}>Position</Label>
                <Input
                  id={`position-${index}`}
                  value={experience.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={experience.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                <Input
                  id={`start-date-${index}`}
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`end-date-${index}`}>End Date</Label>
                <Input
                  id={`end-date-${index}`}
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  placeholder="Leave blank if current"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                placeholder="• Describe your responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible"
                className="min-h-[120px]"
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Each line will automatically be formatted with bullet points
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">No work experience added</h3>
              <p className="text-gray-600 text-sm">Add your professional experience to get started</p>
            </div>
            <Button onClick={addExperience} className="mt-2">
              Add Your First Experience
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExperienceFormEnhanced;
