
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Education {
  id: number;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description?: string;
  courses?: string;
  honors?: string;
}

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [generatingAI, setGeneratingAI] = useState<number | null>(null);

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now(),
      school: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
      courses: '',
      honors: ''
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    onChange(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const removeEducation = (id: number) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const generateAIDescription = async (eduId: number) => {
    const education = data.find(edu => edu.id === eduId);
    if (!education || !education.degree || !education.school) {
      toast.error('Please fill in degree and school first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(eduId);
    try {
      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt: `Generate a professional education description for a resume. 
          Degree: ${education.degree}
          School: ${education.school}
          GPA: ${education.gpa || 'Not specified'}
          
          Create a brief, professional description (2-3 lines) highlighting relevant coursework, achievements, or skills gained. Keep it concise and relevant for a resume.`,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        updateEducation(eduId, 'description', result.content.trim());
        toast.success('AI description generated successfully!');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate description. Please check your API key.');
    } finally {
      setGeneratingAI(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Education
          <Button onClick={addEducation} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((edu) => (
          <div key={edu.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Education {data.indexOf(edu) + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>School/University *</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="Harvard University"
                />
              </div>
              <div>
                <Label>Degree *</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Cambridge, MA"
                />
              </div>
              <div>
                <Label>GPA</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2020"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>

            {/* AI-Enhanced Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIDescription(edu.id)}
                  disabled={generatingAI === edu.id}
                  className="flex items-center gap-2"
                >
                  {generatingAI === edu.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <Textarea
                value={edu.description || ''}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                placeholder="Brief description of achievements, relevant coursework, or skills gained..."
                rows={3}
              />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Relevant Courses</Label>
                <Textarea
                  value={edu.courses || ''}
                  onChange={(e) => updateEducation(edu.id, 'courses', e.target.value)}
                  placeholder="Data Structures, Algorithms, Machine Learning, Database Systems..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Honors & Awards</Label>
                <Input
                  value={edu.honors || ''}
                  onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                  placeholder="Dean's List, Magna Cum Laude, Outstanding Student Award..."
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No education added yet. Click "Add Education" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
