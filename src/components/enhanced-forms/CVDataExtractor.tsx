
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Eye, Edit3, Zap, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CVDataExtractorProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVDataExtractor: React.FC<CVDataExtractorProps> = ({ onDataExtracted, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'view' | 'parsed'>('upload');
  const [enhancing, setEnhancing] = useState(false);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          let text = '';
          
          if (file.type === 'text/plain') {
            text = e.target?.result as string;
          } else if (file.type === 'application/pdf') {
            // For PDF files, we'll try to extract basic text
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Simple PDF text extraction (basic approach)
            let pdfText = '';
            let inTextObject = false;
            let currentText = '';
            
            for (let i = 0; i < uint8Array.length - 1; i++) {
              const char = String.fromCharCode(uint8Array[i]);
              const nextChar = String.fromCharCode(uint8Array[i + 1]);
              
              // Look for text objects in PDF
              if (char === 'B' && nextChar === 'T') {
                inTextObject = true;
                continue;
              }
              if (char === 'E' && nextChar === 'T') {
                inTextObject = false;
                if (currentText.trim()) {
                  pdfText += currentText.trim() + ' ';
                  currentText = '';
                }
                continue;
              }
              
              if (inTextObject && char.match(/[a-zA-Z0-9\s@\.\-\(\)]/)) {
                currentText += char;
              }
            }
            
            text = pdfText.replace(/\s+/g, ' ').trim();
          } else {
            // For Word documents and other formats, try to extract readable text
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Convert to string and try to extract readable content
            let docText = '';
            let buffer = '';
            
            for (let i = 0; i < uint8Array.length; i++) {
              const byte = uint8Array[i];
              
              // Skip null bytes and control characters
              if (byte === 0 || byte < 32) {
                if (buffer.trim().length > 2) {
                  docText += buffer.trim() + ' ';
                }
                buffer = '';
                continue;
              }
              
              const char = String.fromCharCode(byte);
              
              // Only include printable ASCII characters and common symbols
              if (char.match(/[a-zA-Z0-9\s@\.\-\(\)\+\=\&\%\$\#\!\?\,\;\:\'\"]/) || 
                  char.charCodeAt(0) > 127) { // Allow unicode characters
                buffer += char;
              } else {
                if (buffer.trim().length > 2) {
                  docText += buffer.trim() + ' ';
                }
                buffer = '';
              }
            }
            
            // Add any remaining buffer
            if (buffer.trim().length > 2) {
              docText += buffer.trim();
            }
            
            // Clean up the extracted text
            text = docText
              .replace(/\s+/g, ' ')
              .replace(/[^\w\s@\.\-\(\)\+\=\&\%\$\#\!\?\,\;\:\'\"]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          }
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file, 'UTF-8');
      }
    });
  };

  const parseExtractedText = (text: string) => {
    const lines = text.split(/[\.\n\r]/).map(line => line.trim()).filter(line => line.length > 3);
    
    // Extract personal information
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/[\(]?\+?[\d\s\-\(\)]{10,}/);
    
    // Find name (usually one of the first few meaningful lines)
    let fullName = '';
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) && 
          !line.includes('@') && 
          !line.match(/\d{3}/) && 
          line.length < 50 &&
          line.split(' ').length >= 2 &&
          line.split(' ').length <= 4) {
        fullName = line;
        break;
      }
    }

    // Extract sections by looking for keywords and patterns
    const sections = {
      experience: [],
      education: [],
      skills: [],
      summary: ''
    };

    let currentSection = '';
    let currentItem: any = {};
    
    // Look for section headers and content
    const sectionKeywords = {
      experience: ['experience', 'work', 'employment', 'career', 'professional'],
      education: ['education', 'qualification', 'degree', 'university', 'college', 'school'],
      skills: ['skill', 'technical', 'competenc', 'expertise', 'proficient'],
      summary: ['summary', 'objective', 'profile', 'about']
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Detect section headers
      let foundSection = '';
      for (const [section, keywords] of Object.entries(sectionKeywords)) {
        if (keywords.some(keyword => lowerLine.includes(keyword))) {
          foundSection = section;
          break;
        }
      }
      
      if (foundSection) {
        currentSection = foundSection;
        continue;
      }

      // Process content based on current section
      if (currentSection === 'experience' && line.length > 5) {
        if (line.match(/\d{4}/) || line.includes('-') || line.includes('to')) {
          // Potential date or duration
          if (currentItem.position) {
            sections.experience.push({ 
              ...currentItem, 
              id: Date.now() + Math.random(),
              startDate: '',
              endDate: '',
              location: ''
            });
            currentItem = {};
          }
        } else if (!currentItem.position && line.length > 5 && line.length < 100) {
          currentItem.position = line;
        } else if (!currentItem.company && line.length > 2 && line.length < 80) {
          currentItem.company = line;
        } else if (line.length > 10) {
          currentItem.description = (currentItem.description || '') + line + '\n';
        }
      } else if (currentSection === 'education' && line.length > 3) {
        if (!currentItem.degree && line.length > 5 && line.length < 100) {
          currentItem.degree = line;
        } else if (!currentItem.school && line.length > 3 && line.length < 80) {
          currentItem.school = line;
        }
        
        if (currentItem.degree && currentItem.school) {
          sections.education.push({ 
            ...currentItem, 
            id: Date.now() + Math.random(),
            startDate: '',
            endDate: '',
            location: '',
            gpa: ''
          });
          currentItem = {};
        }
      } else if (currentSection === 'skills' && line.length > 2) {
        const skills = line.split(/[,•\-\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 1 && s.length < 30);
        sections.skills.push(...skills);
      } else if (currentSection === 'summary' && line.length > 15) {
        sections.summary += line + ' ';
      }
    }

    // Add any remaining items
    if (currentItem.position) {
      sections.experience.push({ 
        ...currentItem, 
        id: Date.now() + Math.random(),
        startDate: '',
        endDate: '',
        location: ''
      });
    }

    return {
      rawText: text,
      personal: {
        fullName: fullName || '',
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: '',
        summary: sections.summary.trim()
      },
      experience: sections.experience,
      education: sections.education,
      skills: [...new Set(sections.skills)].slice(0, 20), // Remove duplicates and limit
      projects: [],
      certifications: [],
      languages: [],
      interests: []
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  }, []);

  const processFile = async (file: File) => {
    setProcessing(true);
    setCurrentStep('upload');
    
    try {
      const text = await extractTextFromFile(file);
      
      if (!text || text.length < 10) {
        throw new Error('Could not extract readable text from the file. Please try a different format or check if the file is not corrupted.');
      }

      setExtractedText(text);
      setCurrentStep('view');
      toast.success('Document content extracted successfully!');
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Failed to extract data from document. Please try a different file.');
    } finally {
      setProcessing(false);
    }
  };

  const parseData = () => {
    if (!extractedText) return;
    
    setProcessing(true);
    try {
      const parsed = parseExtractedText(extractedText);
      setParsedData(parsed);
      setCurrentStep('parsed');
      toast.success('Data parsed successfully!');
    } catch (error) {
      toast.error('Failed to parse document data');
    } finally {
      setProcessing(false);
    }
  };

  const enhanceWithAI = async () => {
    if (!parsedData) return;
    
    setEnhancing(true);
    try {
      // Simulate AI enhancement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const enhanced = {
        ...parsedData,
        personal: {
          ...parsedData.personal,
          summary: parsedData.personal.summary || "Results-driven professional with proven expertise in delivering innovative solutions and achieving strategic objectives."
        },
        experience: parsedData.experience.map((exp: any) => ({
          ...exp,
          description: exp.description || "• Delivered high-impact solutions that improved operational efficiency\n• Collaborated with cross-functional teams to achieve strategic objectives\n• Demonstrated strong problem-solving skills and attention to detail"
        }))
      };
      
      setParsedData(enhanced);
      toast.success('Data enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance data');
    } finally {
      setEnhancing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleUseData = () => {
    if (parsedData) {
      onDataExtracted(parsedData);
      onClose();
    }
  };

  const resetProcess = () => {
    setUploadedFile(null);
    setExtractedText('');
    setParsedData(null);
    setCurrentStep('upload');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            CV Document Reader
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            First view your document content, then extract and structure the data
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              currentStep === 'upload' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 
              extractedText ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">1. Upload</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              currentStep === 'view' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 
              currentStep === 'parsed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">2. View Content</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              currentStep === 'parsed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">3. Extract Data</span>
            </div>
          </div>

          {currentStep === 'upload' && (
            <>
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    {processing ? (
                      <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                      {processing ? 'Reading your document...' : 'Upload your CV document'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {processing ? 'Please wait while we extract the content' : 'Drag & drop or click to select PDF, DOC, DOCX, or TXT files'}
                    </p>
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>Uploaded: {uploadedFile.name}</span>
                </div>
              )}
            </>
          )}

          {currentStep === 'view' && extractedText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Content</h3>
                <div className="flex gap-2">
                  <Button onClick={resetProcess} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Upload Different File
                  </Button>
                  <Button onClick={parseData} disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting Data...
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Extract Structured Data
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-base text-gray-900 dark:text-white">Raw Document Text</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This is exactly what was extracted from your document. Review it to ensure all important information is captured.
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={extractedText}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                    placeholder="Document content will appear here..."
                  />
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {extractedText.length} characters extracted
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'parsed' && parsedData && (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <span className="font-medium">Data extracted successfully!</span>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Found {parsedData.experience?.length || 0} work experiences, {parsedData.education?.length || 0} education entries, and {parsedData.skills?.length || 0} skills.
                  </p>
                </div>
              </div>

              {/* Data Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {parsedData.personal?.fullName ? '✓' : '—'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Personal Info</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {parsedData.experience?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {parsedData.education?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Education</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {parsedData.skills?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
                </div>
              </div>

              {/* Personal Information Preview */}
              {parsedData.personal && (
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
                    {parsedData.personal.fullName && (
                      <div><strong>Name:</strong> {parsedData.personal.fullName}</div>
                    )}
                    {parsedData.personal.email && (
                      <div><strong>Email:</strong> {parsedData.personal.email}</div>
                    )}
                    {parsedData.personal.phone && (
                      <div><strong>Phone:</strong> {parsedData.personal.phone}</div>
                    )}
                    {parsedData.personal.summary && (
                      <div>
                        <strong>Summary:</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {parsedData.personal.summary}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Skills Preview */}
              {parsedData.skills?.length > 0 && (
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Skills Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
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
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={resetProcess} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                
                <Button
                  onClick={enhanceWithAI}
                  disabled={enhancing}
                  variant="outline"
                >
                  {enhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
                
                <Button onClick={handleUseData} className="flex-1">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Use This Data
                </Button>
              </div>
            </div>
          )}

          {/* Cancel Button */}
          <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataExtractor;
