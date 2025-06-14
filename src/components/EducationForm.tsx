
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
      console.log('Generating AI description for education:', education);
      
      const prompt = `Generate a professional education description for a resume. 
      Degree: ${education.degree}
      School: ${education.school}
      GPA: ${education.gpa || 'Not specified'}
      
      Create a brief, professional description (2-3 lines) highlighting relevant coursework, achievements, or skills gained. Keep it concise and relevant for a resume.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      console.log('AI Response:', result, 'Error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate description');
      }

      if (result?.content) {
        updateEducation(eduId, 'description', result.content.trim());
        toast.success('AI description generated successfully!');
      } else {
        throw new Error('No content received from AI');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(`Failed to generate description: ${error.message}`);
    } finally {
      setGeneratingAI(null);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center justify-between text-gray-800">
          <span className="flex items-center gap-2">
            🎓 Education
          </span>
          <Button onClick={addEducation} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {data.map((edu, index) => (
          <div key={edu.id} className="border border-gray-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  {index + 1}
                </span>
                Education {index + 1}
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">School/University *</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="Harvard University"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Degree *</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Cambridge, MA"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">GPA</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2020"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">End Date</Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2024"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* AI-Enhanced Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIDescription(edu.id)}
                  disabled={generatingAI === edu.id || !edu.degree || !edu.school}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200"
                >
                  {generatingAI === edu.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 text-purple-600" />
                  )}
                  <span className="text-purple-700">Generate with AI</span>
                </Button>
              </div>
              <Textarea
                value={edu.description || ''}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                placeholder="Brief description of achievements, relevant coursework, or skills gained..."
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Relevant Courses</Label>
                <Textarea
                  value={edu.courses || ''}
                  onChange={(e) => updateEducation(edu.id, 'courses', e.target.value)}
                  placeholder="Data Structures, Algorithms, Machine Learning, Database Systems..."
                  rows={2}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Honors & Awards</Label>
                <Input
                  value={edu.honors || ''}
                  onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                  placeholder="Dean's List, Magna Cum Laude, Outstanding Student Award..."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-lg font-medium mb-2">No education added yet</h3>
            <p className="text-sm mb-4">Click "Add Education" to get started with your educational background</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
