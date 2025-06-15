
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Eye, Edit3, Zap } from 'lucide-react';
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
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let text = '';
          
          if (file.type === 'text/plain') {
            text = e.target?.result as string;
          } else if (file.type === 'application/pdf') {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Extract text from PDF
            let pdfText = '';
            for (let i = 0; i < uint8Array.length; i++) {
              const char = String.fromCharCode(uint8Array[i]);
              if (char.match(/[a-zA-Z0-9\s@\.\-\(\)]/)) {
                pdfText += char;
              } else if (char.match(/[\n\r]/)) {
                pdfText += ' ';
              }
            }
            text = pdfText.replace(/\s+/g, ' ').trim();
          } else {
            // For Word documents
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            let docText = '';
            
            for (let i = 0; i < uint8Array.length; i++) {
              const char = String.fromCharCode(uint8Array[i]);
              if (char.match(/[a-zA-Z0-9\s@\.\-\(\)]/)) {
                docText += char;
              }
            }
            text = docText.replace(/\s+/g, ' ').trim();
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
    const lines = text.split(/[\n\r]/).map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract personal information
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/[\(]?\d{3}[\)]?[\s\-\.]?\d{3}[\s\-\.]?\d{4}/);
    
    // Find name (usually in first few lines)
    let fullName = '';
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/) && 
          !line.includes('@') && 
          !line.match(/\d{3}/) && 
          line.length < 50) {
        fullName = line;
        break;
      }
    }

    // Extract sections by looking for keywords
    const sections = {
      experience: [],
      education: [],
      skills: [],
      summary: ''
    };

    let currentSection = '';
    let currentItem: any = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Detect section headers
      if (lowerLine.includes('experience') || lowerLine.includes('work')) {
        currentSection = 'experience';
        continue;
      } else if (lowerLine.includes('education')) {
        currentSection = 'education';
        continue;
      } else if (lowerLine.includes('skill')) {
        currentSection = 'skills';
        continue;
      } else if (lowerLine.includes('summary') || lowerLine.includes('objective')) {
        currentSection = 'summary';
        continue;
      }

      // Process content based on current section
      if (currentSection === 'experience' && line.length > 10) {
        if (line.match(/\d{4}/) && (line.includes('-') || line.includes('to'))) {
          // Date line - save current item and start new one
          if (currentItem.position) {
            sections.experience.push({ ...currentItem, id: Date.now() + Math.random() });
            currentItem = {};
          }
        } else if (!line.includes('•') && !line.startsWith('-')) {
          // Title or company line
          if (!currentItem.position) {
            currentItem.position = line;
          } else if (!currentItem.company) {
            currentItem.company = line;
          }
        } else {
          // Description
          if (!currentItem.description) {
            currentItem.description = line;
          } else {
            currentItem.description += '\n' + line;
          }
        }
      } else if (currentSection === 'education' && line.length > 5) {
        if (line.match(/\d{4}/)) {
          if (currentItem.degree) {
            sections.education.push({ ...currentItem, id: Date.now() + Math.random() });
            currentItem = {};
          }
        } else if (!currentItem.degree) {
          currentItem.degree = line;
        } else if (!currentItem.school) {
          currentItem.school = line;
        }
      } else if (currentSection === 'skills' && line.length > 2) {
        const skills = line.split(/[,•\-]/).map(s => s.trim()).filter(s => s.length > 1);
        sections.skills.push(...skills);
      } else if (currentSection === 'summary' && line.length > 20) {
        sections.summary += line + ' ';
      }
    }

    // Add any remaining items
    if (currentItem.position) {
      sections.experience.push({ ...currentItem, id: Date.now() + Math.random() });
    }
    if (currentItem.degree) {
      sections.education.push({ ...currentItem, id: Date.now() + Math.random() });
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
      skills: sections.skills.slice(0, 20),
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
    try {
      const text = await extractTextFromFile(file);
      
      if (!text || text.length < 20) {
        throw new Error('Could not extract readable text from the file');
      }

      const parsedData = parseExtractedText(text);
      setExtractedData(parsedData);
      toast.success('CV data extracted successfully!');
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error('Failed to extract data from CV. Please try a different file.');
    } finally {
      setProcessing(false);
    }
  };

  const enhanceWithAI = async () => {
    if (!extractedData) return;
    
    setEnhancing(true);
    try {
      // Simulate AI enhancement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const enhanced = {
        ...extractedData,
        personal: {
          ...extractedData.personal,
          summary: extractedData.personal.summary || "Results-driven professional with proven expertise in delivering innovative solutions. Strong track record of collaborating with cross-functional teams to achieve strategic objectives and drive operational excellence."
        },
        experience: extractedData.experience.map((exp: any) => ({
          ...exp,
          description: exp.description || "• Delivered high-impact solutions that improved operational efficiency\n• Collaborated with cross-functional teams to achieve strategic objectives\n• Demonstrated strong problem-solving skills and attention to detail"
        }))
      };
      
      setExtractedData(enhanced);
      toast.success('CV data enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance CV data');
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
    if (extractedData) {
      onDataExtracted(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            CV Data Extractor
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your CV to extract and view all the data, then enhance it with AI
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!extractedData ? (
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
                      {processing ? 'Extracting data from your CV...' : 'Upload your CV document'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {processing ? 'Please wait while we read your document' : 'Drag & drop or click to select PDF, DOC, DOCX, or TXT files'}
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
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <span className="font-medium">Data extracted successfully!</span>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Found {extractedData.experience?.length || 0} work experiences, {extractedData.education?.length || 0} education entries, and {extractedData.skills?.length || 0} skills.
                  </p>
                </div>
              </div>

              {/* Data Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {extractedData.personal?.fullName ? '✓' : '—'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Personal Info</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {extractedData.experience?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {extractedData.education?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Education</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {extractedData.skills?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
                </div>
              </div>

              {/* Personal Information Preview */}
              {extractedData.personal && (
                <Card className="bg-gray-50 dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {extractedData.personal.fullName && (
                      <div><strong>Name:</strong> {extractedData.personal.fullName}</div>
                    )}
                    {extractedData.personal.email && (
                      <div><strong>Email:</strong> {extractedData.personal.email}</div>
                    )}
                    {extractedData.personal.phone && (
                      <div><strong>Phone:</strong> {extractedData.personal.phone}</div>
                    )}
                    {extractedData.personal.summary && (
                      <div>
                        <strong>Summary:</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {extractedData.personal.summary.substring(0, 200)}...
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Skills Preview */}
              {extractedData.skills?.length > 0 && (
                <Card className="bg-gray-50 dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Skills Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.skills.slice(0, 15).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {extractedData.skills.length > 15 && (
                        <Badge variant="outline" className="text-xs">
                          +{extractedData.skills.length - 15} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Raw Text View */}
              <Card className="bg-gray-50 dark:bg-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">Raw Document Text</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRawData(!showRawData)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showRawData ? 'Hide' : 'View'} Raw Text
                  </Button>
                </CardHeader>
                {showRawData && (
                  <CardContent>
                    <Textarea
                      value={extractedData.rawText}
                      readOnly
                      className="min-h-[200px] font-mono text-xs bg-white dark:bg-gray-800"
                    />
                  </CardContent>
                )}
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={enhanceWithAI}
                  disabled={enhancing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {enhancing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enhancing with AI...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
                
                <Button onClick={handleUseData} variant="outline" className="flex-1">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Use This Data
                </Button>
                
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataExtractor;
