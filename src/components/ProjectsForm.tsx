
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, FolderOpen, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
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
    toast.success('New project added');
  };

  const updateProject = (id: number, field: keyof Project, value: string) => {
    onChange(data.map(project => project.id === id ? { ...project, [field]: value } : project));
  };

  const removeProject = (id: number) => {
    onChange(data.filter(project => project.id !== id));
    toast.success('Project removed');
  };

  const projectTemplates = [
    {
      name: 'E-commerce Website',
      description: 'Built a responsive e-commerce platform with shopping cart functionality, user authentication, and payment integration.',
      technologies: 'React, Node.js, MongoDB, Stripe API'
    },
    {
      name: 'Mobile App',
      description: 'Developed a cross-platform mobile application for task management with real-time synchronization.',
      technologies: 'React Native, Firebase, Redux'
    },
    {
      name: 'Data Analytics Dashboard',
      description: 'Created an interactive dashboard for visualizing business metrics and generating automated reports.',
      technologies: 'Python, D3.js, PostgreSQL, Flask'
    }
  ];

  const addProjectTemplate = (template: typeof projectTemplates[0]) => {
    const newProject: Project = {
      id: Date.now(),
      name: template.name,
      description: template.description,
      technologies: template.technologies,
      link: '',
      startDate: '',
      endDate: ''
    };
    onChange([...data, newProject]);
    toast.success(`Added "${template.name}" project template`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Projects
          </div>
          <Button onClick={addProject} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Templates */}
        {data.length === 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-purple-900 dark:text-purple-100">Project Templates</h4>
            <div className="space-y-3">
              {projectTemplates.map((template, index) => (
                <div key={index} className="border rounded p-3 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{template.name}</h5>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addProjectTemplate(template)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Use
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                  <p className="text-xs text-gray-500"><strong>Tech:</strong> {template.technologies}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.map((project, index) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Project {index + 1}</h4>
              <div className="flex gap-2">
                {project.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="e.g., E-commerce Website"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  placeholder="e.g., January 2024"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  placeholder="e.g., March 2024 or Present"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label>Project Link/URL</Label>
              <Input
                value={project.link}
                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                placeholder="https://github.com/username/project or https://project-demo.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Project Description *</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Describe your project, what it does, your role, and key achievements..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No projects added yet.</p>
            <p className="text-sm">Click "Add Project" or choose from templates above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsForm;
