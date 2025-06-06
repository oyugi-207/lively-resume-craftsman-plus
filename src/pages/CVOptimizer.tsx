import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  ArrowLeft,
  Download,
  Upload,
  FileUp,
  BarChart3,
  Lightbulb,
  CheckCircle,
  Edit,
  Save,
  Check
} from 'lucide-react';

const CVOptimizer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [originalResume, setOriginalResume] = useState<any>(null);
  const [optimizedResume, setOptimizedResume] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableResume, setEditableResume] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Basic file validation
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB");
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          // Mock resume data (replace with actual parsing logic)
          const parsedResume = {
            title: file.name,
            personal_info: {
              fullName: "John Doe",
              email: "john.doe@example.com",
              phone: "123-456-7890",
              summary: "A highly skilled professional with experience in multiple fields."
            },
            experience: [
              {
                position: "Software Engineer",
                company: "Tech Innovations Inc.",
                startDate: "2020-01-01",
                endDate: "2022-12-31",
                description: "Developed and maintained web applications using React and Node.js."
              }
            ],
            education: [
              {
                degree: "Bachelor of Science in Computer Science",
                school: "University of Technology",
                year: "2019"
              }
            ],
            skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"]
          };

          setOriginalResume(parsedResume);
          setOptimizedResume(null);
          setSuggestions([]);
          toast({
            title: "File Uploaded",
            description: "Resume uploaded successfully. Click 'Optimize' to continue."
          });
        }
      };
      reader.readAsText(file);
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const optimizeResume = async () => {
    if (!originalResume) {
      toast({
        title: "Error",
        description: "No resume uploaded to optimize",
        variant: "destructive"
      });
      return;
    }

    setOptimizing(true);
    try {
      // Mock AI optimization (replace with actual AI logic)
      const optimizedData = {
        ...originalResume,
        personal_info: {
          ...originalResume.personal_info,
          summary: "An experienced software engineer with a proven track record of delivering high-quality solutions."
        },
        skills: [...originalResume.skills, "Problem Solving", "Team Collaboration"],
        experience: originalResume.experience.map((exp: any) => ({
          ...exp,
          description: "• Developed and maintained web applications using React and Node.js\n• Improved application performance by 20%\n• Collaborated with cross-functional teams"
        }))
      };

      setOptimizedResume(optimizedData);
      setEditableResume(optimizedData);
      setSuggestions([
        "Improved summary to highlight key achievements",
        "Added problem-solving and team collaboration to skills",
        "Enhanced experience descriptions with quantifiable results"
      ]);

      toast({
        title: "Optimization Complete",
        description: "Resume optimized successfully"
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Error",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };

  const downloadOptimizedResume = async () => {
    if (!optimizedResume || !previewRef.current) {
      toast({
        title: "Error",
        description: "No optimized resume to download",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    try {
      const element = previewRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgDisplayWidth = imgWidth * ratio;
      const imgDisplayHeight = imgHeight * ratio;
      
      const x = (pdfWidth - imgDisplayWidth) / 2;
      const y = 10; // Small top margin

      pdf.addImage(imgData, 'PNG', x, y, imgDisplayWidth, imgDisplayHeight - 10);
      
      const fileName = `optimized_resume_${Date.now()}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Optimized resume downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const saveAsNewResume = async () => {
    if (!user || !optimizedResume) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          ...optimizedResume,
          user_id: user.id,
          title: `${optimizedResume.title} (Optimized)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Optimized resume saved to your dashboard"
      });

      // Navigate to edit the new resume
      navigate(`/builder?id=${data.id}`);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive"
      });
    }
  };

  const handleEdit = () => {
    setEditableResume({ ...optimizedResume });
    setEditMode(true);
  };

  const saveEdits = () => {
    setOptimizedResume({ ...editableResume });
    setEditMode(false);
    toast({
      title: "Changes Saved",
      description: "Your edits have been applied to the preview"
    });
  };

  const cancelEdits = () => {
    setEditableResume(null);
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-xl">
          <CardTitle className="mb-4 text-2xl">Authentication Required</CardTitle>
          <p className="text-gray-600 mb-6">Please sign in to use the CV optimizer.</p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CV Optimizer</h1>
              <p className="text-gray-600 dark:text-gray-400">Upload and optimize your resume with AI</p>
            </div>
          </div>
          {optimizedResume && (
            <div className="flex items-center space-x-3">
              {!editMode ? (
                <>
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Resume
                  </Button>
                  <Button variant="outline" onClick={saveAsNewResume}>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Dashboard
                  </Button>
                  <Button 
                    onClick={downloadOptimizedResume}
                    disabled={downloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={cancelEdits}>
                    Cancel
                  </Button>
                  <Button onClick={saveEdits} className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {!optimizedResume ? (
          // Upload Section
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center bg-white dark:bg-gray-800 shadow-sm">
              <div className="mb-6">
                <Upload className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload Your Resume
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Upload your current resume and let our AI optimize it for better ATS compatibility and impact.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 transition-colors hover:border-blue-400">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="resume-upload" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileUp className="w-12 h-12 text-gray-400 mb-4" />
                    <span className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Choose your resume file
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Supports PDF, DOC, DOCX (Max 10MB)
                    </span>
                  </label>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">Uploading and processing...</span>
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What our AI optimizer does:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                  <li>• Improves ATS compatibility and keyword optimization</li>
                  <li>• Enhances formatting and visual appeal</li>
                  <li>• Strengthens bullet points and descriptions</li>
                  <li>• Provides actionable improvement suggestions</li>
                </ul>
              </div>
            </Card>
          </div>
        ) : (
          // Results Section
          <div className="space-y-6">
            {/* Optimization Results Header */}
            <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Optimization Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your resume has been optimized for better ATS compatibility and impact.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowComparison(!showComparison)}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {showComparison ? 'Hide' : 'Show'} Comparison
                  </Button>
                  <Button
                    onClick={optimizeResume}
                    disabled={optimizing}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {optimizing ? 'Optimizing...' : 'Optimize'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  AI Suggestions Applied
                </h3>
                <div className="grid gap-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800 dark:text-green-200">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Content */}
            <div className={showComparison ? "grid lg:grid-cols-2 gap-6" : ""}>
              {showComparison && originalResume && (
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original Resume</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                    {/* Original Resume Preview */}
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {originalResume.personal_info?.fullName || 'Name'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {originalResume.personal_info?.email || 'Email'} | {originalResume.personal_info?.phone || 'Phone'}
                        </p>
                      </div>
                      
                      {originalResume.personal_info?.summary && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">Summary</h5>
                          <p className="text-gray-600 dark:text-gray-400">{originalResume.personal_info.summary}</p>
                        </div>
                      )}
                      
                      {originalResume.experience?.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">Experience</h5>
                          {originalResume.experience.map((exp: any, index: number) => (
                            <div key={index} className="mb-2">
                              <p className="font-medium">{exp.position} at {exp.company}</p>
                              <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                              <p className="text-sm">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Optimized Resume */}
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editMode ? 'Edit Resume' : 'Optimized Resume'}
                  </h3>
                  {editMode && (
                    <span className="text-sm text-blue-600 dark:text-blue-400">Edit mode active</span>
                  )}
                </div>
                
                <div 
                  ref={previewRef} 
                  className="bg-white text-black p-8 rounded-lg min-h-[600px] max-h-[800px] overflow-y-auto"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {editMode ? (
                    // Edit Mode
                    <div className="space-y-6">
                      {/* Personal Info Editing */}
                      <div className="border-b pb-4">
                        <Input
                          value={editableResume?.personal_info?.fullName || ''}
                          onChange={(e) => setEditableResume(prev => ({
                            ...prev,
                            personal_info: { ...prev.personal_info, fullName: e.target.value }
                          }))}
                          className="text-2xl font-bold border-0 p-0 mb-2"
                          placeholder="Full Name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={editableResume?.personal_info?.email || ''}
                            onChange={(e) => setEditableResume(prev => ({
                              ...prev,
                              personal_info: { ...prev.personal_info, email: e.target.value }
                            }))}
                            placeholder="Email"
                            className="text-sm"
                          />
                          <Input
                            value={editableResume?.personal_info?.phone || ''}
                            onChange={(e) => setEditableResume(prev => ({
                              ...prev,
                              personal_info: { ...prev.personal_info, phone: e.target.value }
                            }))}
                            placeholder="Phone"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {/* Summary Editing */}
                      <div>
                        <h4 className="font-semibold mb-2">Professional Summary</h4>
                        <Textarea
                          value={editableResume?.personal_info?.summary || ''}
                          onChange={(e) => setEditableResume(prev => ({
                            ...prev,
                            personal_info: { ...prev.personal_info, summary: e.target.value }
                          }))}
                          placeholder="Professional summary..."
                          className="min-h-[100px]"
                        />
                      </div>

                      {/* Skills Editing */}
                      <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        <Input
                          value={editableResume?.skills?.join(', ') || ''}
                          onChange={(e) => setEditableResume(prev => ({
                            ...prev,
                            skills: e.target.value.split(', ').filter(skill => skill.trim())
                          }))}
                          placeholder="Skill 1, Skill 2, Skill 3..."
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    // Preview Mode
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center border-b border-gray-300 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {optimizedResume.personal_info?.fullName || 'Your Name'}
                        </h1>
                        <div className="text-gray-600 space-x-4">
                          <span>{optimizedResume.personal_info?.email || 'email@example.com'}</span>
                          <span>•</span>
                          <span>{optimizedResume.personal_info?.phone || '+1 (555) 123-4567'}</span>
                          {optimizedResume.personal_info?.location && (
                            <>
                              <span>•</span>
                              <span>{optimizedResume.personal_info.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Professional Summary */}
                      {optimizedResume.personal_info?.summary && (
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                            PROFESSIONAL SUMMARY
                          </h2>
                          <p className="text-gray-700 leading-relaxed">
                            {optimizedResume.personal_info.summary}
                          </p>
                        </div>
                      )}

                      {/* Core Skills */}
                      {optimizedResume.skills && optimizedResume.skills.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                            CORE COMPETENCIES
                          </h2>
                          <div className="grid grid-cols-3 gap-2">
                            {optimizedResume.skills.map((skill: string, index: number) => (
                              <span key={index} className="text-gray-700 text-sm">
                                • {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Professional Experience */}
                      {optimizedResume.experience && optimizedResume.experience.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                            PROFESSIONAL EXPERIENCE
                          </h2>
                          {optimizedResume.experience.map((exp: any, index: number) => (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <p className="font-medium text-gray-700 mb-2">{exp.company}</p>
                              <div className="text-gray-700 text-sm leading-relaxed">
                                {exp.description?.split('\n').map((line: string, lineIndex: number) => (
                                  <p key={lineIndex} className="mb-1">
                                    {line.startsWith('•') ? line : `• ${line}`}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Education */}
                      {optimizedResume.education && optimizedResume.education.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                            EDUCATION
                          </h2>
                          {optimizedResume.education.map((edu: any, index: number) => (
                            <div key={index} className="mb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                  <p className="text-gray-700">{edu.school}</p>
                                </div>
                                <span className="text-sm text-gray-600">{edu.year}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVOptimizer;
