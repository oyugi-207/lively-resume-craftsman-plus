
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Save, 
  Download, 
  Wand2, 
  User, 
  Briefcase, 
  GraduationCap,
  Award,
  Languages,
  Heart,
  FolderOpen,
  Users,
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAPIKey } from '@/hooks/useAPIKey';

interface EditableCVTemplateProps {
  data: any;
  onDataChange: (data: any) => void;
  onSave: () => void;
  onDownload: () => void;
}

const EditableCVTemplate: React.FC<EditableCVTemplateProps> = ({
  data,
  onDataChange,
  onSave,
  onDownload
}) => {
  const { getApiKey } = useAPIKey();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [aiEnhancing, setAiEnhancing] = useState<string | null>(null);

  const updatePersonalField = (field: string, value: string) => {
    onDataChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value
      }
    });
  };

  const updateArraySection = (section: string, newItems: any[]) => {
    onDataChange({
      ...data,
      [section]: newItems
    });
  };

  const enhanceWithAI = async (section: string, content: string) => {
    const apiKey = getApiKey('gemini');
    if (!apiKey) {
      toast.error('Please set your Gemini API key in Settings first');
      return;
    }

    setAiEnhancing(section);
    try {
      let prompt = '';
      
      switch (section) {
        case 'summary':
          prompt = `Enhance this professional summary to be more impactful and ATS-friendly. Keep it concise and professional: "${content}"`;
          break;
        case 'experience':
          prompt = `Improve these work experience bullet points to be more compelling and results-focused. Use action verbs and quantify achievements where possible: "${content}"`;
          break;
        case 'skills':
          prompt = `Organize and enhance this skills list to be more comprehensive and industry-relevant: "${content}"`;
          break;
        default:
          prompt = `Improve and format this content to be more professional and clear: "${content}"`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('AI enhancement failed');
      }

      const aiData = await response.json();
      const enhancedContent = aiData.candidates?.[0]?.content?.parts?.[0]?.text || content;

      if (section === 'summary') {
        updatePersonalField('summary', enhancedContent);
      }

      toast.success('Content enhanced with AI!');
    } catch (error) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance content with AI');
    } finally {
      setAiEnhancing(null);
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header with Actions */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h2 className="text-xl font-bold text-gray-900">Editable CV Template</h2>
        <div className="flex gap-2">
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={onDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
            >
              <Edit className="w-3 h-3 mr-1" />
              {editingSection === 'personal' ? 'View' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'personal' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-blue-800">Full Name</label>
                <Input
                  value={data.personal.fullName || ''}
                  onChange={(e) => updatePersonalField('fullName', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-800">Email</label>
                <Input
                  value={data.personal.email || ''}
                  onChange={(e) => updatePersonalField('email', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-800">Phone</label>
                <Input
                  value={data.personal.phone || ''}
                  onChange={(e) => updatePersonalField('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-blue-800">Location</label>
                <Input
                  value={data.personal.location || ''}
                  onChange={(e) => updatePersonalField('location', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-blue-800">Professional Summary</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => enhanceWithAI('summary', data.personal.summary || '')}
                    disabled={aiEnhancing === 'summary'}
                    className="text-purple-600 border-purple-600"
                  >
                    {aiEnhancing === 'summary' ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3 mr-1" />
                    )}
                    AI Enhance
                  </Button>
                </div>
                <Textarea
                  value={data.personal.summary || ''}
                  onChange={(e) => updatePersonalField('summary', e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">{data.personal.fullName || 'Full Name'}</h1>
                <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
                  {data.personal.email && <span>{data.personal.email}</span>}
                  {data.personal.phone && <span>{data.personal.phone}</span>}
                  {data.personal.location && <span>{data.personal.location}</span>}
                </div>
              </div>
              {data.personal.summary && (
                <div className="mt-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Briefcase className="w-5 h-5" />
              Work Experience
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
            >
              <Edit className="w-3 h-3 mr-1" />
              {editingSection === 'experience' ? 'View' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'experience' ? (
            <div className="space-y-4">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="p-4 border border-green-300 rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder="Company"
                      value={exp.company || ''}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[index] = { ...updated[index], company: e.target.value };
                        updateArraySection('experience', updated);
                      }}
                    />
                    <Input
                      placeholder="Position"
                      value={exp.position || ''}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[index] = { ...updated[index], position: e.target.value };
                        updateArraySection('experience', updated);
                      }}
                    />
                    <Input
                      placeholder="Location"
                      value={exp.location || ''}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[index] = { ...updated[index], location: e.target.value };
                        updateArraySection('experience', updated);
                      }}
                    />
                    <Input
                      placeholder="Duration"
                      value={exp.duration || ''}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[index] = { ...updated[index], duration: e.target.value };
                        updateArraySection('experience', updated);
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Description</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => enhanceWithAI('experience', exp.description || '')}
                      disabled={aiEnhancing === `experience-${index}`}
                      className="text-purple-600 border-purple-600"
                    >
                      {aiEnhancing === `experience-${index}` ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Wand2 className="w-3 h-3 mr-1" />
                      )}
                      AI Enhance
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Job responsibilities and achievements"
                    value={exp.description || ''}
                    onChange={(e) => {
                      const updated = [...data.experience];
                      updated[index] = { ...updated[index], description: e.target.value };
                      updateArraySection('experience', updated);
                    }}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data.experience.map((exp: any, index: number) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">{exp.position || 'Position'}</h4>
                    <span className="text-sm text-gray-600">{exp.duration || 'Duration'}</span>
                  </div>
                  <div className="text-green-700 font-medium mb-2">
                    {exp.company || 'Company'} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {exp.description.split('\n').map((line: string, i: number) => (
                        <div key={i} className="mb-1">{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <GraduationCap className="w-5 h-5" />
              Education
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingSection(editingSection === 'education' ? null : 'education')}
            >
              <Edit className="w-3 h-3 mr-1" />
              {editingSection === 'education' ? 'View' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'education' ? (
            <div className="space-y-4">
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="p-4 border border-purple-300 rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="School/University"
                      value={edu.school || ''}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[index] = { ...updated[index], school: e.target.value };
                        updateArraySection('education', updated);
                      }}
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree || ''}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[index] = { ...updated[index], degree: e.target.value };
                        updateArraySection('education', updated);
                      }}
                    />
                    <Input
                      placeholder="Location"
                      value={edu.location || ''}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[index] = { ...updated[index], location: e.target.value };
                        updateArraySection('education', updated);
                      }}
                    />
                    <Input
                      placeholder="Duration"
                      value={edu.duration || ''}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[index] = { ...updated[index], duration: e.target.value };
                        updateArraySection('education', updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h4>
                      <div className="text-purple-700 font-medium">{edu.school || 'School'}</div>
                      {edu.location && <div className="text-sm text-gray-600">{edu.location}</div>}
                    </div>
                    <span className="text-sm text-gray-600">{edu.duration || 'Duration'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Award className="w-5 h-5" />
              Skills
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => enhanceWithAI('skills', data.skills.join(', '))}
                disabled={aiEnhancing === 'skills'}
                className="text-purple-600 border-purple-600"
              >
                {aiEnhancing === 'skills' ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3 mr-1" />
                )}
                AI Enhance
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
              >
                <Edit className="w-3 h-3 mr-1" />
                {editingSection === 'skills' ? 'View' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingSection === 'skills' ? (
            <Textarea
              placeholder="Enter skills separated by commas"
              value={data.skills.join(', ')}
              onChange={(e) => {
                const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                updateArraySection('skills', skillsArray);
              }}
              rows={3}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Enhancement Panel */}
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Sparkles className="w-5 h-5" />
            AI Enhancement Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-purple-700 mb-3">
            Use AI to enhance specific sections of your CV for better impact and ATS optimization.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => enhanceWithAI('summary', data.personal.summary || '')}
              disabled={aiEnhancing === 'summary'}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {aiEnhancing === 'summary' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Enhance Summary
            </Button>
            <Button
              onClick={() => {
                if (data.experience.length > 0) {
                  enhanceWithAI('experience', data.experience[0].description || '');
                }
              }}
              disabled={aiEnhancing?.startsWith('experience')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {aiEnhancing?.startsWith('experience') ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Enhance Experience
            </Button>
            <Button
              onClick={() => enhanceWithAI('skills', data.skills.join(', '))}
              disabled={aiEnhancing === 'skills'}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {aiEnhancing === 'skills' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Enhance Skills
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableCVTemplate;
