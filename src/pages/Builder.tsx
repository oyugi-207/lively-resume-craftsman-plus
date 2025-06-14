import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from '@/components/ModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Lightbulb, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Download,
  Upload,
  Save,
  Loader2,
  Wand2,
  Brain,
  Star
} from "lucide-react";
import JobDescriptionParser from '@/components/JobDescriptionParser';
import { useAPIKey } from '@/hooks/useAPIKey';

const Builder = () => {
  const { user, signOut: logout } = useAuth();
  const navigate = useNavigate();
  const { hasApiKey } = useAPIKey();

  const [formData, setFormData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    experience: [
      {
        id: 1,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ],
    skills: [] as string[],
    projects: [
      {
        id: 1,
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ],
    certifications: [
      {
        id: 1,
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        credentialUrl: ''
      }
    ],
    awards: [
      {
        id: 1,
        name: '',
        organization: '',
        date: '',
        description: ''
      }
    ]
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [isJobDescriptionParserOpen, setIsJobDescriptionParserOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadResumeData();
    }
  }, [user, navigate]);

  const loadResumeData = async () => {
    setLoading(true);
    try {
      const resumeData = localStorage.getItem('resumeData');
      if (resumeData) {
        setFormData(JSON.parse(resumeData));
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
      toast.error('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const saveResumeData = async () => {
    setSaving(true);
    try {
      localStorage.setItem('resumeData', JSON.stringify(formData));
      toast.success('Resume data saved successfully!');
    } catch (error) {
      console.error('Error saving resume data:', error);
      toast.error('Failed to save resume data');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    setFormData(prev => {
      if (index !== undefined && Array.isArray(prev[section])) {
        const updatedSection = [...prev[section]];
        updatedSection[index] = { ...updatedSection[index], [field]: value };
        return { ...prev, [section]: updatedSection };
      } else if (section === 'skills') {
        return { ...prev, skills: value };
      } else if (typeof prev[section] === 'object') {
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      } else {
        return { ...prev, [section]: value };
      }
    });
  };

  const handleAddSectionItem = (section: string) => {
    setFormData(prev => {
      const newItem = { id: Date.now() };
      return { ...prev, [section]: [...prev[section], newItem] };
    });
  };

  const handleRemoveSectionItem = (section: string, id: number, index: number) => {
    setFormData(prev => {
      const updatedSection = [...prev[section]];
      updatedSection.splice(index, 1);
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleJobDescriptionParsed = (parsedData: any) => {
    console.log('Parsed job data:', parsedData);
    
    // Flatten skills from nested structure to array
    let flattenedSkills: string[] = [];
    
    if (parsedData.skills) {
      if (typeof parsedData.skills === 'object' && !Array.isArray(parsedData.skills)) {
        // Handle nested structure (technical/soft/business categories)
        Object.values(parsedData.skills).forEach((category: any) => {
          if (typeof category === 'object' && !Array.isArray(category)) {
            // Handle subcategories (programming, frameworks, etc.)
            Object.values(category).forEach((subcategory: any) => {
              if (Array.isArray(subcategory)) {
                flattenedSkills.push(...subcategory);
              }
            });
          } else if (Array.isArray(category)) {
            flattenedSkills.push(...category);
          }
        });
      } else if (Array.isArray(parsedData.skills)) {
        // Handle flat array structure
        flattenedSkills = parsedData.skills;
      }
    }

    // Remove duplicates
    flattenedSkills = [...new Set(flattenedSkills)];

    // Update form data
    setFormData(prev => ({
      ...prev,
      skills: flattenedSkills,
      personal: {
        ...prev.personal,
        summary: parsedData.summary || prev.personal.summary
      }
    }));

    // Show optimization suggestions if available
    if (parsedData.atsOptimization?.recommendations) {
      toast.success('Job analysis applied! Check the Skills section for extracted skills.');
    } else {
      toast.success('Job description data applied to resume!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading resume data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-12 px-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">Create your professional resume with ease</p>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="destructive" onClick={logout}>Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeSection === 'personal' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('personal')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </Button>
                <Button 
                  variant={activeSection === 'experience' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('experience')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Experience
                </Button>
                <Button 
                  variant={activeSection === 'education' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('education')}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Education
                </Button>
                <Button 
                  variant={activeSection === 'skills' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('skills')}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Skills
                </Button>
                <Button 
                  variant={activeSection === 'projects' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('projects')}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Projects
                </Button>
                <Button 
                  variant={activeSection === 'certifications' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('certifications')}
                >
                  <Badge className="mr-2">Cert</Badge>
                  Certifications
                </Button>
                 <Button 
                  variant={activeSection === 'awards' ? 'secondary' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setActiveSection('awards')}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Awards
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSection === 'personal' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          type="text" 
                          id="name" 
                          value={formData.personal.name}
                          onChange={(e) => handleInputChange('personal', 'name', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          type="email" 
                          id="email"
                          value={formData.personal.email}
                          onChange={(e) => handleInputChange('personal', 'email', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          type="tel" 
                          id="phone"
                          value={formData.personal.phone}
                          onChange={(e) => handleInputChange('personal', 'phone', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          type="text" 
                          id="location"
                          value={formData.personal.location}
                          onChange={(e) => handleInputChange('personal', 'location', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          type="url" 
                          id="linkedin"
                          value={formData.personal.linkedin}
                          onChange={(e) => handleInputChange('personal', 'linkedin', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input 
                          type="url" 
                          id="github"
                          value={formData.personal.github}
                          onChange={(e) => handleInputChange('personal', 'github', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          type="url" 
                          id="website"
                          value={formData.personal.website}
                          onChange={(e) => handleInputChange('personal', 'website', e.target.value)} 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea 
                        id="summary" 
                        placeholder="Write a brief summary about yourself"
                        value={formData.personal.summary}
                        onChange={(e) => handleInputChange('personal', 'summary', e.target.value)} 
                      />
                    </div>
                  </>
                )}

                {activeSection === 'experience' && (
                  <>
                    {formData.experience.map((exp, index) => (
                      <div key={exp.id} className="space-y-2 border p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`title-${exp.id}`}>Title</Label>
                            <Input 
                              type="text" 
                              id={`title-${exp.id}`}
                              value={exp.title}
                              onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`company-${exp.id}`}>Company</Label>
                            <Input 
                              type="text" 
                              id={`company-${exp.id}`}
                              value={exp.company}
                              onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${exp.id}`}>Location</Label>
                            <Input 
                              type="text" 
                              id={`location-${exp.id}`}
                              value={exp.location}
                              onChange={(e) => handleInputChange('experience', 'location', e.target.value, index)} 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                              <Input 
                                type="date" 
                                id={`startDate-${exp.id}`}
                                value={exp.startDate}
                                onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)} 
                              />
                            </div>
                            <div>
                              <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                              <Input 
                                type="date" 
                                id={`endDate-${exp.id}`}
                                value={exp.endDate}
                                onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)} 
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${exp.id}`}>Description</Label>
                          <Textarea 
                            id={`description-${exp.id}`}
                            placeholder="Describe your responsibilities and achievements"
                            value={exp.description}
                            onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)} 
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveSectionItem('experience', exp.id, index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={() => handleAddSectionItem('experience')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </>
                )}

                {activeSection === 'education' && (
                  <>
                    {formData.education.map((edu, index) => (
                      <div key={edu.id} className="space-y-2 border p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                            <Input 
                              type="text" 
                              id={`institution-${edu.id}`}
                              value={edu.institution}
                              onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                            <Input 
                              type="text" 
                              id={`degree-${edu.id}`}
                              value={edu.degree}
                              onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${edu.id}`}>Location</Label>
                            <Input 
                              type="text" 
                              id={`location-${edu.id}`}
                              value={edu.location}
                              onChange={(e) => handleInputChange('education', 'location', e.target.value, index)} 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                              <Input 
                                type="date" 
                                id={`startDate-${edu.id}`}
                                value={edu.startDate}
                                onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)} 
                              />
                            </div>
                            <div>
                              <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                              <Input 
                                type="date" 
                                id={`endDate-${edu.id}`}
                                value={edu.endDate}
                                onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)} 
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${edu.id}`}>Description</Label>
                          <Textarea 
                            id={`description-${edu.id}`}
                            placeholder="Describe your studies and achievements"
                            value={edu.description}
                            onChange={(e) => handleInputChange('education', 'description', e.target.value, index)} 
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveSectionItem('education', edu.id, index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={() => handleAddSectionItem('education')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </>
                )}

                {activeSection === 'skills' && (
                  <>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      type="text"
                      id="skills"
                      placeholder="Enter your skills, separated by commas"
                      value={formData.skills.join(', ')}
                      onChange={(e) => {
                        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
                        handleInputChange('skills', '', skillsArray as any);
                      }}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Enter each skill separated by a comma (e.g., JavaScript, React, Node.js)
                    </p>
                  </>
                )}

                {activeSection === 'projects' && (
                  <>
                    {formData.projects.map((project, index) => (
                      <div key={project.id} className="space-y-2 border p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${project.id}`}>Name</Label>
                            <Input 
                              type="text" 
                              id={`name-${project.id}`}
                              value={project.name}
                              onChange={(e) => handleInputChange('projects', 'name', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`technologies-${project.id}`}>Technologies</Label>
                            <Input 
                              type="text" 
                              id={`technologies-${project.id}`}
                              value={project.technologies}
                              onChange={(e) => handleInputChange('projects', 'technologies', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`link-${project.id}`}>Link</Label>
                            <Input 
                              type="url" 
                              id={`link-${project.id}`}
                              value={project.link}
                              onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)} 
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${project.id}`}>Description</Label>
                          <Textarea 
                            id={`description-${project.id}`}
                            placeholder="Describe the project and your role"
                            value={project.description}
                            onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)} 
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveSectionItem('projects', project.id, index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={() => handleAddSectionItem('projects')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </>
                )}

                {activeSection === 'certifications' && (
                  <>
                    {formData.certifications.map((cert, index) => (
                      <div key={cert.id} className="space-y-2 border p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${cert.id}`}>Name</Label>
                            <Input 
                              type="text" 
                              id={`name-${cert.id}`}
                              value={cert.name}
                              onChange={(e) => handleInputChange('certifications', 'name', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`issuingOrganization-${cert.id}`}>Issuing Organization</Label>
                            <Input 
                              type="text" 
                              id={`issuingOrganization-${cert.id}`}
                              value={cert.issuingOrganization}
                              onChange={(e) => handleInputChange('certifications', 'issuingOrganization', e.target.value, index)} 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`issueDate-${cert.id}`}>Issue Date</Label>
                              <Input 
                                type="date" 
                                id={`issueDate-${cert.id}`}
                                value={cert.issueDate}
                                onChange={(e) => handleInputChange('certifications', 'issueDate', e.target.value, index)} 
                              />
                            </div>
                            <div>
                              <Label htmlFor={`expirationDate-${cert.id}`}>Expiration Date</Label>
                              <Input 
                                type="date" 
                                id={`expirationDate-${cert.id}`}
                                value={cert.expirationDate}
                                onChange={(e) => handleInputChange('certifications', 'expirationDate', e.target.value, index)} 
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`credentialId-${cert.id}`}>Credential ID</Label>
                            <Input 
                              type="text" 
                              id={`credentialId-${cert.id}`}
                              value={cert.credentialId}
                              onChange={(e) => handleInputChange('certifications', 'credentialId', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`credentialUrl-${cert.id}`}>Credential URL</Label>
                            <Input 
                              type="url" 
                              id={`credentialUrl-${cert.id}`}
                              value={cert.credentialUrl}
                              onChange={(e) => handleInputChange('certifications', 'credentialUrl', e.target.value, index)} 
                            />
                          </div>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveSectionItem('certifications', cert.id, index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={() => handleAddSectionItem('certifications')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </>
                )}

                {activeSection === 'awards' && (
                  <>
                    {formData.awards.map((award, index) => (
                      <div key={award.id} className="space-y-2 border p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${award.id}`}>Name</Label>
                            <Input 
                              type="text" 
                              id={`name-${award.id}`}
                              value={award.name}
                              onChange={(e) => handleInputChange('awards', 'name', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`organization-${award.id}`}>Organization</Label>
                            <Input 
                              type="text" 
                              id={`organization-${award.id}`}
                              value={award.organization}
                              onChange={(e) => handleInputChange('awards', 'organization', e.target.value, index)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor={`date-${award.id}`}>Date</Label>
                            <Input 
                              type="date" 
                              id={`date-${award.id}`}
                              value={award.date}
                              onChange={(e) => handleInputChange('awards', 'date', e.target.value, index)} 
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`description-${award.id}`}>Description</Label>
                          <Textarea 
                            id={`description-${award.id}`}
                            placeholder="Describe the award and your achievement"
                            value={award.description}
                            onChange={(e) => handleInputChange('awards', 'description', e.target.value, index)} 
                          />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveSectionItem('awards', award.id, index)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={() => handleAddSectionItem('awards')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Award
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                variant="secondary"
                onClick={() => setIsJobDescriptionParserOpen(true)}
                disabled={!hasApiKey}
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Analyze Job Description
              </Button>
              <Button 
                onClick={saveResumeData} 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <JobDescriptionParser
        isOpen={isJobDescriptionParserOpen}
        onClose={() => setIsJobDescriptionParserOpen(false)}
        onParsed={handleJobDescriptionParsed}
      />
    </div>
  );
};

export default Builder;
