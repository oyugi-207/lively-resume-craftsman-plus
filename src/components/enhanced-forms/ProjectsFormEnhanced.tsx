
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Wand2, Loader2, FolderOpen, ExternalLink, Code, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAPIKey } from '@/hooks/useAPIKey';

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

interface ProjectsFormEnhancedProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsFormEnhanced: React.FC<ProjectsFormEnhancedProps> = ({ data, onChange }) => {
  const { apiKey } = useAPIKey();
  const [generatingAI, setGeneratingAI] = useState<number | null>(null);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: number, field: keyof Project, value: string) => {
    onChange(data.map(project => project.id === id ? { ...project, [field]: value } : project));
  };

  const removeProject = (id: number) => {
    onChange(data.filter(project => project.id !== id));
  };

  const generateAIDescription = async (projectId: number) => {
    const project = data.find(p => p.id === projectId);
    if (!project || !project.name) {
      toast.error('Please fill in project name first');
      return;
    }

    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings');
      return;
    }

    setGeneratingAI(projectId);
    try {
      const prompt = `Generate a professional project description for a resume. 
      Project Name: ${project.name}
      Technologies: ${project.technologies || 'Various technologies'}
      
      Create a compelling 2-3 line description highlighting the project's purpose, key features, and impact. Focus on technical achievements and business value. Make it sound professional and impressive for a resume.`;

      const { data: result, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          prompt,
          apiKey 
        }
      });

      if (error) throw error;

      if (result?.content) {
        updateProject(projectId, 'description', result.content.trim());
        toast.success('AI description generated successfully!');
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
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Showcase your notable projects</p>
          </div>
        </div>
        <Button onClick={addProject} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {data.map((project, index) => (
        <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-800 dark:to-violet-950/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="relative pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-violet-700 dark:text-violet-300 font-bold text-sm">{index + 1}</span>
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Project {index + 1}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Project Name *
                </Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                  className="border-violet-200 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Project Link
                </Label>
                <div className="relative">
                  <Input
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="border-violet-200 focus:border-violet-500 focus:ring-violet-500/20 pr-10"
                  />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </Label>
                <Input
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  placeholder="2024"
                  className="border-violet-200 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </Label>
                <Input
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  placeholder="2024"
                  className="border-violet-200 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Technologies Used
              </Label>
              <Input
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS"
                className="border-violet-200 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            {/* AI-Enhanced Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIDescription(project.id)}
                  disabled={generatingAI === project.id || !project.name}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 shadow-sm"
                >
                  {generatingAI === project.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 text-purple-600" />
                  )}
                  <span className="text-purple-700">Generate with AI</span>
                </Button>
              </div>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Describe the project's purpose, key features, and impact..."
                rows={4}
                className="border-violet-200 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-violet-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No projects added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Click "Add Project" to showcase your notable work and achievements</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsFormEnhanced;
