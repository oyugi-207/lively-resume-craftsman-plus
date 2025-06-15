
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Brain, Wand2, Loader2, Sparkles, FileText, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

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
  const [jobDescription, setJobDescription] = useState('');
  const [generatingExperience, setGeneratingExperience] = useState(false);
  const [enhancingId, setEnhancingId] = useState<number | null>(null);
  const [showJobInput, setShowJobInput] = useState(false);

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

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: number) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const generateExperienceFromJob = async () => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setGeneratingExperience(true);
    try {
      const prompt = `Based on this job description: "${jobDescription}", create a relevant work experience entry. Include:
      - A suitable job title that aligns with the requirements
      - A realistic company name (use placeholder like "Tech Company Inc.")
      - A professional location
      - 3-4 bullet points describing relevant achievements and responsibilities
      - Use action verbs and quantify results where possible
      
      Format the response as JSON with: position, company, location, description (as bullet points)`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        try {
          const experienceData = JSON.parse(result.content);
          const newExperience: Experience = {
            id: Date.now(),
            company: experienceData.company || 'Company Name',
            position: experienceData.position || 'Position Title',
            location: experienceData.location || 'City, State',
            startDate: '',
            endDate: '',
            description: experienceData.description || '• Add your achievements here'
          };
          
          onChange([...data, newExperience]);
          toast.success('AI-generated experience added!');
          setShowJobInput(false);
        } catch (parseError) {
          // Fallback if JSON parsing fails
          const newExperience: Experience = {
            id: Date.now(),
            company: 'AI Generated Company',
            position: 'Relevant Position',
            location: 'City, State',
            startDate: '',
            endDate: '',
            description: result.content
          };
          onChange([...data, newExperience]);
          toast.success('AI-generated experience added!');
          setShowJobInput(false);
        }
      }
    } catch (error: any) {
      console.error('AI experience generation error:', error);
      toast.error('Failed to generate experience. Please check your API key.');
    } finally {
      setGeneratingExperience(false);
    }
  };

  const enhanceExperienceDescription = async (experienceId: number) => {
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    const experience = data.find(exp => exp.id === experienceId);
    if (!experience || !experience.description.trim()) {
      toast.error('Please add a description first to enhance it');
      return;
    }

    setEnhancingId(experienceId);
    try {
      const jobContext = jobDescription.trim() 
        ? `Job target: ${jobDescription}\n\n` 
        : '';
      
      const prompt = `${jobContext}Enhance this work experience description: "${experience.description}". 
      Make it more compelling and ATS-friendly by:
      - Using strong action verbs
      - Adding quantifiable achievements where possible
      - Highlighting relevant skills and technologies
      - Formatting as clear bullet points
      - Making it relevant to the target job if provided`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        updateExperience(experienceId, 'description', result.content.trim());
        toast.success('Experience description enhanced with AI!');
      }
    } catch (error: any) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance description. Please check your API key.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Professional Experience
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={addExperience} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
          <Button
            onClick={() => setShowJobInput(!showJobInput)}
            variant="outline"
            size="sm"
            className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20"
          >
            <Target className="w-4 h-4 mr-2" />
            Generate from Job
          </Button>
        </div>

        {showJobInput && (
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description to generate relevant experience..."
              className="min-h-[100px] mb-3"
            />
            <Button
              onClick={generateExperienceFromJob}
              disabled={generatingExperience}
              size="sm"
              className="w-full"
            >
              {generatingExperience ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Experience...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Relevant Experience
                </>
              )}
            </Button>
          </div>
        )}

        {data.map((experience) => (
          <Card key={experience.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Experience Entry</h4>
                <div className="flex gap-2">
                  <Button
                    onClick={() => enhanceExperienceDescription(experience.id)}
                    disabled={enhancingId === experience.id}
                    variant="outline"
                    size="sm"
                  >
                    {enhancingId === experience.id ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3 mr-1" />
                    )}
                    Enhance
                  </Button>
                  <Button
                    onClick={() => removeExperience(experience.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Position *</label>
                  <Input
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company *</label>
                  <Input
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="Tech Company Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    value={experience.location}
                    onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <Input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                      placeholder="Present"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  placeholder="• Led a team of 5 developers in building a web application that increased user engagement by 40%&#10;• Implemented new features using React and Node.js, reducing load times by 25%&#10;• Collaborated with cross-functional teams to deliver projects on time and within budget"
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use bullet points (•) to highlight your achievements and responsibilities
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No experience entries yet. Add your first experience or generate one from a job description.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceFormEnhanced;
