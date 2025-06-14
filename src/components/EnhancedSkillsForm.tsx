
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X, Code, Users, Briefcase, Zap, Search } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'certification';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface EnhancedSkillsFormProps {
  data: string[];
  onChange: (skills: string[]) => void;
}

const POPULAR_SKILLS = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'HTML/CSS',
    'Java', 'C++', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Figma'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Team Management',
    'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management'
  ],
  language: [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'
  ],
  certification: [
    'AWS Certified', 'Google Analytics', 'PMP', 'Scrum Master', 'Microsoft Certified'
  ]
};

const EnhancedSkillsForm: React.FC<EnhancedSkillsFormProps> = ({ data, onChange }) => {
  const [skills, setSkills] = useState<Skill[]>(
    data.map((skill, index) => ({
      id: index,
      name: skill,
      category: 'technical',
      level: 'intermediate'
    }))
  );
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Skill['category']>('technical');
  const [selectedLevel, setSelectedLevel] = useState<Skill['level']>('intermediate');
  const [searchTerm, setSearchTerm] = useState('');

  const updateParent = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    onChange(updatedSkills.map(skill => skill.name));
  };

  const addSkill = () => {
    if (!newSkill.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    if (skills.some(skill => skill.name.toLowerCase() === newSkill.toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    const skill: Skill = {
      id: Date.now(),
      name: newSkill.trim(),
      category: selectedCategory,
      level: selectedLevel
    };

    updateParent([...skills, skill]);
    setNewSkill('');
    toast.success('Skill added successfully');
  };

  const addPopularSkill = (skillName: string) => {
    if (skills.some(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    const skill: Skill = {
      id: Date.now(),
      name: skillName,
      category: selectedCategory,
      level: 'intermediate'
    };

    updateParent([...skills, skill]);
    toast.success(`${skillName} added to your skills`);
  };

  const removeSkill = (id: number) => {
    updateParent(skills.filter(skill => skill.id !== id));
    toast.success('Skill removed');
  };

  const updateSkillLevel = (id: number, level: Skill['level']) => {
    updateParent(skills.map(skill => 
      skill.id === id ? { ...skill, level } : skill
    ));
  };

  const getSkillsByCategory = (category: Skill['category']) => {
    return skills.filter(skill => skill.category === category);
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPopularSkills = POPULAR_SKILLS[selectedCategory].filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !skills.some(existingSkill => existingSkill.name.toLowerCase() === skill.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Enhanced Skills Management
          <Badge variant="secondary">{skills.length} skills</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Skill Section */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-white">Add New Skill</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Skill Name</Label>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g., React, Leadership"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={(value: Skill['category']) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Technical
                    </div>
                  </SelectItem>
                  <SelectItem value="soft">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Soft Skills
                    </div>
                  </SelectItem>
                  <SelectItem value="language">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4">🌐</span>
                      Language
                    </div>
                  </SelectItem>
                  <SelectItem value="certification">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Certification
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <Select value={selectedLevel} onValueChange={(value: Skill['level']) => setSelectedLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={addSkill} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </div>

        {/* Popular Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Popular Skills</h3>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
          
          <Tabs value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value as Skill['category'])}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="soft" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Soft Skills
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                🌐 Languages
              </TabsTrigger>
              <TabsTrigger value="certification" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Certifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedCategory} className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {filteredPopularSkills.map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => addPopularSkill(skill)}
                    className="text-sm hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {skill}
                  </Button>
                ))}
              </div>
              {filteredPopularSkills.length === 0 && (
                <p className="text-gray-500 text-sm">No matching skills found</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Current Skills Display */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Your Skills</h3>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({skills.length})</TabsTrigger>
              <TabsTrigger value="technical">Technical ({getSkillsByCategory('technical').length})</TabsTrigger>
              <TabsTrigger value="soft">Soft ({getSkillsByCategory('soft').length})</TabsTrigger>
              <TabsTrigger value="language">Languages ({getSkillsByCategory('language').length})</TabsTrigger>
              <TabsTrigger value="certification">Certs ({getSkillsByCategory('certification').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {skills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No skills added yet. Add some skills to get started!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <Select
                          value={skill.level}
                          onValueChange={(value: Skill['level']) => updateSkillLevel(skill.id, value)}
                        >
                          <SelectTrigger className="w-full mt-2 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {(['technical', 'soft', 'language', 'certification'] as const).map((category) => (
              <TabsContent key={category} value={category} className="space-y-3">
                {getSkillsByCategory(category).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No {category} skills added yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {getSkillsByCategory(category).map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2 bg-white dark:bg-gray-800 border rounded-lg p-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <Badge className={`text-xs ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSkillsForm;
