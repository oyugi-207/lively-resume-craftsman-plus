
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Briefcase, GraduationCap, Award } from 'lucide-react';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  languages: Array<{
    id: number;
    language: string;
    proficiency: string;
  }>;
  interests: string[];
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }>;
}

interface CVDataEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

const CVDataEditor: React.FC<CVDataEditorProps> = ({ data, onDataChange }) => {
  const updatePersonalInfo = (field: string, value: string) => {
    onDataChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...data.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    onDataChange({
      ...data,
      experience: updatedExperience
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onDataChange({
      ...data,
      experience: [...data.experience, newExperience]
    });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = data.experience.filter((_, i) => i !== index);
    onDataChange({
      ...data,
      experience: updatedExperience
    });
  };

  const updateSkills = (skillsText: string) => {
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(s => s);
    onDataChange({
      ...data,
      skills: skillsArray
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-300">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-blue-800 dark:text-blue-300">Full Name</Label>
            <Input
              id="fullName"
              value={data.personal.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-800 dark:text-blue-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.personal.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-blue-800 dark:text-blue-300">Phone</Label>
            <Input
              id="phone"
              value={data.personal.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-blue-800 dark:text-blue-300">Location</Label>
            <Input
              id="location"
              value={data.personal.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="summary" className="text-blue-800 dark:text-blue-300">Professional Summary</Label>
            <Textarea
              id="summary"
              value={data.personal.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              rows={4}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-green-900 dark:text-green-300">
              <Briefcase className="w-5 h-5" />
              Work Experience
            </CardTitle>
            <Button 
              onClick={addExperience} 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="border border-green-300 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-green-800 dark:text-green-300">Experience {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-green-700 dark:text-green-400">Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
                <div>
                  <Label className="text-green-700 dark:text-green-400">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
                <div>
                  <Label className="text-green-700 dark:text-green-400">Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
                <div>
                  <Label className="text-green-700 dark:text-green-400">End Date</Label>
                  <Input
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <Label className="text-green-700 dark:text-green-400">Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  rows={3}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-900 dark:text-purple-300">
            <Award className="w-5 h-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="skills" className="text-purple-800 dark:text-purple-300">Skills (comma-separated)</Label>
          <Textarea
            id="skills"
            value={data.skills.join(', ')}
            onChange={(e) => updateSkills(e.target.value)}
            rows={3}
            placeholder="JavaScript, React, Node.js, Python..."
            className="border-purple-300 focus:border-purple-500"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataEditor;
