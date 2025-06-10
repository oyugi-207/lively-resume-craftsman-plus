
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, Wand2, Loader2, CheckCircle } from 'lucide-react';

interface JobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const JobDescriptionParser: React.FC<JobDescriptionParserProps> = ({ isOpen, onClose, onParsed }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setParsing(true);
    try {
      // Enhanced job description parsing logic
      const data = extractJobRequirements(jobDescription);
      setParsedData(data);
      toast.success('Job description parsed successfully!');
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to parse job description');
    } finally {
      setParsing(false);
    }
  };

  const extractJobRequirements = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Extract skills
    const skillPatterns = [
      /(?:skills?|technologies?|tools?|experience with|proficient in|knowledge of)[\s:]*([^.!?\n]+)/gi,
      /(?:required|preferred|must have|should have)[\s:]*([^.!?\n]+)/gi
    ];

    const skills = new Set<string>();
    
    // Common technical skills
    const techSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'MongoDB',
      'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'TypeScript', 'Vue.js',
      'Angular', 'PHP', 'Ruby', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Redis',
      'GraphQL', 'REST API', 'Microservices', 'DevOps', 'CI/CD', 'Jenkins', 'Terraform',
      'Linux', 'Windows', 'macOS', 'Agile', 'Scrum', 'Jira', 'Confluence'
    ];

    // Soft skills
    const softSkills = [
      'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management',
      'Project Management', 'Critical Thinking', 'Analytical', 'Creative', 'Adaptable',
      'Detail-oriented', 'Self-motivated', 'Collaborative', 'Strategic Thinking'
    ];

    // Check for technical skills
    techSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    });

    // Check for soft skills
    softSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        skills.add(skill);
      }
    });

    // Extract additional skills from patterns
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const skillText = match.split(/[:]/)[1] || match;
          const extractedSkills = skillText
            .split(/[,\n•·\-\|]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 30)
            .map(s => s.charAt(0).toUpperCase() + s.slice(1));
          
          extractedSkills.forEach(skill => skills.add(skill));
        });
      }
    });

    // Extract job title
    const titlePatterns = [
      /(?:position|role|job title|title)[\s:]*([^\n.!?]+)/gi,
      /(?:seeking|looking for|hiring)[\s:]*([^\n.!?]+)/gi
    ];

    let jobTitle = '';
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        jobTitle = match[1].trim();
        break;
      }
    }

    // Extract company info
    const companyPatterns = [
      /(?:company|organization|firm)[\s:]*([^\n.!?]+)/gi,
      /(?:at|with|for)[\s]+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Company|Ltd)?)/g
    ];

    let company = '';
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        company = match[1].trim();
        break;
      }
    }

    // Extract years of experience
    const experiencePattern = /(\d+)[\s]*(?:\+|\-)?[\s]*(?:years?|yrs?)[\s]*(?:of)?[\s]*(?:experience|exp)/gi;
    const experienceMatch = text.match(experiencePattern);
    const yearsExperience = experienceMatch ? parseInt(experienceMatch[0]) : 0;

    // Extract education requirements
    const educationPatterns = [
      /(?:bachelor|master|phd|degree|diploma)[\s]*(?:in|of)?[\s]*([^\n.!?]+)/gi,
      /(?:education|qualification)[\s:]*([^\n.!?]+)/gi
    ];

    const educationReqs = [];
    educationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          educationReqs.push(match.trim());
        });
      }
    });

    // Generate tailored summary
    const topSkills = Array.from(skills).slice(0, 5);
    const summary = `Experienced professional with ${yearsExperience > 0 ? `${yearsExperience}+ years` : 'proven expertise'} in ${topSkills.slice(0, 3).join(', ')}. ${jobTitle ? `Specialized in ${jobTitle.toLowerCase()} role` : 'Skilled in delivering high-quality results'} with strong focus on ${topSkills.slice(-2).join(' and ')}.`;

    return {
      jobTitle,
      company,
      skills: Array.from(skills).slice(0, 20), // Limit to top 20 skills
      yearsExperience,
      educationRequirements: educationReqs.slice(0, 3),
      summary,
      experience: {
        id: Date.now(),
        position: jobTitle || 'Professional Role',
        company: company || 'Target Company',
        location: '',
        startDate: '',
        endDate: '',
        description: `• Contributed to ${topSkills.slice(0, 2).join(' and ')} initiatives\n• Applied ${topSkills.slice(2, 4).join(' and ')} expertise to drive results\n• Collaborated with cross-functional teams to deliver objectives`
      }
    };
  };

  const handleApply = () => {
    if (parsedData) {
      onParsed(parsedData);
      onClose();
      toast.success('Job requirements applied to resume!');
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setParsedData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            AI Job Description Parser
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Paste Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. Include requirements, skills, responsibilities, and qualifications..."
                className="min-h-[300px] text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={parseJobDescription} 
                disabled={parsing || !jobDescription.trim()}
                className="flex-1"
              >
                {parsing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Parse Job Description
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {parsedData ? (
              <>
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Job description parsed successfully!</span>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    {parsedData.jobTitle && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Job Title</h4>
                        <p className="text-sm text-gray-700">{parsedData.jobTitle}</p>
                      </div>
                    )}

                    {parsedData.company && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Company</h4>
                        <p className="text-sm text-gray-700">{parsedData.company}</p>
                      </div>
                    )}

                    {parsedData.yearsExperience > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Experience Required</h4>
                        <p className="text-sm text-gray-700">{parsedData.yearsExperience}+ years</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Skills ({parsedData.skills.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {parsedData.skills.slice(0, 15).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {parsedData.skills.length > 15 && (
                          <Badge variant="outline" className="text-xs">
                            +{parsedData.skills.length - 15} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {parsedData.summary && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Tailored Summary</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{parsedData.summary}</p>
                      </div>
                    )}

                    {parsedData.educationRequirements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Education Requirements</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {parsedData.educationRequirements.map((req: string, index: number) => (
                            <li key={index} className="text-xs">• {req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={handleApply} className="flex-1">
                    Apply to Resume
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a job description and click "Parse" to extract key requirements</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionParser;
