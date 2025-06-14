
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Wand2, Loader2, GraduationCap, Award, MapPin, Calendar } from 'lucide-react';
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
    if (!education || !education.degree) {
      toast.error('Please fill in degree first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(eduId);
    try {
      console.log('Generating AI description for education:', education);
      
      const prompt = `Generate a professional education description for a resume based on this degree: "${education.degree}".
      ${education.school ? `School: ${education.school}` : ''}
      ${education.gpa ? `GPA: ${education.gpa}` : ''}
      
      Create a brief, professional description (2-3 lines) highlighting relevant coursework, achievements, or skills gained from this degree. Focus on what makes this degree valuable for a professional career. Keep it concise and resume-appropriate.`;

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Education</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add your educational background</p>
          </div>
        </div>
        <Button onClick={addEducation} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.map((edu, index) => (
        <Card key={edu.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="relative pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">{index + 1}</span>
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Education {index + 1}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  School/University *
                </Label>
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="Harvard University"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Degree *
                </Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Cambridge, MA"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  GPA
                </Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="2020"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="2024"
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* AI-Enhanced Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIDescription(edu.id)}
                  disabled={generatingAI === edu.id || !edu.degree}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 shadow-sm"
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
                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relevant Courses</Label>
                <Textarea
                  value={edu.courses || ''}
                  onChange={(e) => updateEducation(edu.id, 'courses', e.target.value)}
                  placeholder="Data Structures, Algorithms, Machine Learning, Database Systems..."
                  rows={2}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Honors & Awards</Label>
                <Input
                  value={edu.honors || ''}
                  onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                  placeholder="Dean's List, Magna Cum Laude, Outstanding Student Award..."
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No education added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Click "Add Education" to get started with your educational background</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EducationForm;
