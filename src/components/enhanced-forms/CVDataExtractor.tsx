
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Download, Save, Edit3 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useAPIKey } from '@/hooks/useAPIKey';
import EditableCVTemplate from './EditableCVTemplate';

interface CVDataExtractorProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVDataExtractor: React.FC<CVDataExtractorProps> = ({ onDataExtracted, onClose }) => {
  const { getApiKey } = useAPIKey();
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Use Supabase edge function for AI-powered extraction
  const extractWithAI = async (file: File): Promise<any> => {
    const apiKey = getApiKey('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key required for CV extraction. Please set it in Settings.');
    }

    try {
      const base64Content = await fileToBase64(file);
      
      const response = await fetch('/functions/v1/cv-reader-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContent: base64Content,
          fileName: file.name,
          fileType: file.type,
          apiKey: apiKey
        })
      });

      if (!response.ok) {
        throw new Error('AI extraction service failed');
      }

      const result = await response.json();
      return result.extractedData;
    } catch (error) {
      console.error('AI extraction failed:', error);
      throw error;
    }
  };

  // Enhanced fallback text extraction
  const extractTextFallback = async (file: File): Promise<string> => {
    console.log('Using fallback text extraction for:', file.type);
    
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }

    // For binary files (PDF, DOCX), try to extract any readable text
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          let text = '';
          
          // Extract readable ASCII characters
          for (let i = 0; i < uint8Array.length; i++) {
            const byte = uint8Array[i];
            if (byte >= 32 && byte <= 126) {
              text += String.fromCharCode(byte);
            } else if (byte === 10 || byte === 13) {
              text += ' ';
            }
          }
          
          // Clean up the text
          text = text.replace(/\s+/g, ' ').trim();
          
          // Look for common patterns
          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{10,}/);
          const words = text.split(' ').filter(word => 
            word.length > 2 && 
            /^[a-zA-Z]+$/.test(word)
          );
          
          if (emailMatch || phoneMatch || words.length > 10) {
            console.log('Fallback extraction found some readable content');
            resolve(text);
          } else {
            reject(new Error('No readable text found in file'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Parse text into structured data
  const parseTextToData = (text: string) => {
    const lines = text.split(/[\n\r]/).map(line => line.trim()).filter(line => line);
    
    const data = {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: [] as any[],
      education: [] as any[],
      skills: [] as string[],
      certifications: [] as any[],
      languages: [] as any[],
      interests: [] as string[],
      projects: [] as any[]
    };

    // Extract personal information
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{10,}/);
    
    if (emailMatch) data.personal.email = emailMatch[0];
    if (phoneMatch) data.personal.phone = phoneMatch[0].trim();

    // Find name (first meaningful line that's not email/phone)
    for (const line of lines.slice(0, 10)) {
      if (!line.includes('@') && !line.match(/\d{3}/) && 
          line.length > 3 && line.length < 50 && 
          /^[a-zA-Z\s]+$/.test(line)) {
        data.personal.fullName = line;
        break;
      }
    }

    // Extract skills (common technical terms)
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 
      'TypeScript', 'MongoDB', 'SQL', 'Git', 'AWS', 'Docker', 'Leadership',
      'Management', 'Communication', 'Problem Solving', 'Teamwork'
    ];
    
    skillKeywords.forEach(skill => {
      if (new RegExp('\\b' + skill + '\\b', 'i').test(text)) {
        data.skills.push(skill);
      }
    });

    // Add basic experience entry if we found any work-related terms
    const workTerms = ['experience', 'work', 'company', 'position', 'job', 'role'];
    if (workTerms.some(term => text.toLowerCase().includes(term))) {
      data.experience.push({
        id: 1,
        company: 'Company Name',
        position: 'Position Title',
        location: '',
        startDate: '',
        endDate: '',
        description: 'Professional experience details'
      });
    }

    // Add basic education entry if we found education terms
    const eduTerms = ['education', 'university', 'college', 'degree', 'bachelor', 'master'];
    if (eduTerms.some(term => text.toLowerCase().includes(term))) {
      data.education.push({
        id: 1,
        school: 'University/School Name',
        degree: 'Degree/Qualification',
        location: '',
        startDate: '',
        endDate: '',
        gpa: ''
      });
    }

    return data;
  };

  // Main extraction function
  const extractFromFile = async (file: File) => {
    setIsExtracting(true);
    console.log('Starting text extraction...');

    try {
      let extractedData;

      // First try AI-powered extraction
      try {
        console.log('Attempting AI extraction...');
        extractedData = await extractWithAI(file);
        console.log('AI extraction successful');
      } catch (aiError) {
        console.log('AI extraction failed, trying fallback methods...');
        
        // Try fallback text extraction
        try {
          const text = await extractTextFallback(file);
          extractedData = parseTextToData(text);
          console.log('Fallback extraction successful');
        } catch (fallbackError) {
          console.log('All extraction methods failed, providing template structure');
          
          // Provide basic template structure for manual entry
          extractedData = {
            personal: {
              fullName: 'Your Full Name',
              email: 'your.email@example.com',
              phone: '+1 (555) 123-4567',
              location: 'City, State',
              summary: 'Professional summary to be updated with your information'
            },
            experience: [{
              id: 1,
              company: 'Company Name',
              position: 'Job Title',
              location: 'City, State',
              startDate: '',
              endDate: '',
              description: 'Describe your role and achievements here'
            }],
            education: [{
              id: 1,
              school: 'University/School Name',
              degree: 'Degree Type and Field',
              location: 'City, State',
              startDate: '',
              endDate: '',
              gpa: ''
            }],
            skills: ['Skill 1', 'Skill 2', 'Skill 3'],
            certifications: [],
            languages: [],
            interests: [],
            projects: []
          };
          
          toast.warning('Could not extract data from file. Please fill in the template manually.');
        }
      }

      console.log('Setting extracted data and showing template');
      setExtractedData(extractedData);
      setShowTemplate(true);
      
      if (extractedData.personal.fullName !== 'Your Full Name') {
        toast.success('CV data extracted successfully!');
      }

    } catch (error: any) {
      console.error('Extraction error:', error);
      toast.error(error.message || 'Failed to process the file. Please try a different file or use the manual template.');
      
      // Provide empty template as last resort
      const fallbackData = {
        personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        interests: [],
        projects: []
      };
      
      setExtractedData(fallbackData);
      setShowTemplate(true);
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      extractFromFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  // Show the template if we have extracted data
  if (showTemplate && extractedData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-h-[90vh] overflow-hidden">
          <EditableCVTemplate
            data={extractedData}
            onDataChange={setExtractedData}
            onSave={() => {
              onDataExtracted(extractedData);
              toast.success('CV data saved!');
              onClose();
            }}
            onDownload={() => {
              // Create downloadable content
              const downloadContent = `
CV Data Export

Personal Information:
Name: ${extractedData.personal.fullName || 'N/A'}
Email: ${extractedData.personal.email || 'N/A'}
Phone: ${extractedData.personal.phone || 'N/A'}
Location: ${extractedData.personal.location || 'N/A'}

Professional Summary:
${extractedData.personal.summary || 'N/A'}

Experience:
${extractedData.experience.map((exp: any, index: number) => `
${index + 1}. ${exp.position || 'Position'} at ${exp.company || 'Company'}
   Location: ${exp.location || 'N/A'}
   Duration: ${exp.duration || exp.startDate + ' - ' + exp.endDate || 'N/A'}
   Description: ${exp.description || 'N/A'}
`).join('\n')}

Education:
${extractedData.education.map((edu: any, index: number) => `
${index + 1}. ${edu.degree || 'Degree'} from ${edu.school || 'School'}
   Location: ${edu.location || 'N/A'}
   Duration: ${edu.duration || edu.startDate + ' - ' + edu.endDate || 'N/A'}
`).join('\n')}

Skills:
${extractedData.skills.join(', ') || 'N/A'}
              `.trim();

              const blob = new Blob([downloadContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'cv-data-export.txt';
              a.click();
              URL.revokeObjectURL(url);
              
              toast.success('CV data downloaded!');
            }}
          />
          
          {/* Close button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white dark:bg-gray-800 shadow-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            AI-Powered CV Extractor
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload your CV and we'll extract and organize your information into an editable template
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isExtracting ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
              </p>
              <p className="text-gray-600 mb-4">
                Drag and drop your CV or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX, and TXT files (max 10MB)
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-lg font-medium mb-2">Processing your CV...</p>
              <p className="text-sm text-gray-600">
                Using AI to extract and organize your information
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-1">How it works:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• AI extracts all information from your CV automatically</li>
                  <li>• Data is organized into an editable template</li>
                  <li>• You can review, edit, and enhance the content</li>
                  <li>• Use AI assistance to improve descriptions and formatting</li>
                  <li>• Save and download your polished CV</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <Button
              onClick={() => {
                // Provide empty template for manual entry
                const emptyData = {
                  personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
                  experience: [],
                  education: [],
                  skills: [],
                  certifications: [],
                  languages: [],
                  interests: [],
                  projects: []
                };
                setExtractedData(emptyData);
                setShowTemplate(true);
              }}
              variant="outline"
            >
              Start with Empty Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataExtractor;
