import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Download, Save, Edit3 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import EditableCVTemplate from './EditableCVTemplate';

interface CVDataExtractorProps {
  onDataExtracted: (data: any) => void;
  onClose: () => void;
}

const CVDataExtractor: React.FC<CVDataExtractorProps> = ({ onDataExtracted, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  // Enhanced PDF extraction with better formatting preservation
  const extractPDFText = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = (window as any).pdfjsLib;
      
      if (pdfjsLib) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Sort text items by Y position (top to bottom) then X position (left to right)
          const sortedItems = textContent.items.sort((a: any, b: any) => {
            const yDiff = Math.abs(a.transform[5] - b.transform[5]);
            if (yDiff > 2) { // Different lines
              return b.transform[5] - a.transform[5]; // Higher Y first (top to bottom)
            }
            return a.transform[4] - b.transform[4]; // Same line, left to right
          });
          
          let currentY: number | null = null;
          let lineText = '';
          
          for (let j = 0; j < sortedItems.length; j++) {
            const item = sortedItems[j];
            const itemY = Math.round(item.transform[5]);
            const itemText = item.str.trim();
            
            if (currentY === null) {
              currentY = itemY;
              lineText = itemText;
            } else if (Math.abs(currentY - itemY) <= 2) {
              // Same line - add spacing if needed
              if (lineText && itemText) {
                const lastChar = lineText[lineText.length - 1];
                const firstChar = itemText[0];
                
                // Add space if needed
                if (lastChar !== ' ' && firstChar !== ' ' && 
                    !['•', '-', '(', ')', '.', ','].includes(lastChar) &&
                    !['•', '-', '(', ')', '.', ','].includes(firstChar)) {
                  lineText += ' ';
                }
              }
              lineText += itemText;
            } else {
              // New line
              if (lineText.trim()) {
                fullText += lineText.trim() + '\n';
              }
              currentY = itemY;
              lineText = itemText;
            }
          }
          
          // Add last line
          if (lineText.trim()) {
            fullText += lineText.trim() + '\n';
          }
          
          // Add page break if not last page
          if (i < pdf.numPages) {
            fullText += '\n---PAGE BREAK---\n\n';
          }
        }
        
        return cleanAndFormatText(fullText);
      } else {
        return await extractPDFTextFallback(file);
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      return await extractPDFTextFallback(file);
    }
  };

  // Improved fallback PDF text extraction with better formatting
  const extractPDFTextFallback = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          let text = '';
          
          // Look for text content in PDF structure
          let i = 0;
          const lines: string[] = [];
          
          while (i < uint8Array.length - 10) {
            // Look for text objects
            if (uint8Array[i] === 0x42 && uint8Array[i + 1] === 0x54) { // "BT" - Begin Text
              i += 2;
              let textContent = '';
              let inString = false;
              let parenCount = 0;
              
              while (i < uint8Array.length - 1) {
                const byte = uint8Array[i];
                const char = String.fromCharCode(byte);
                
                if (char === '(' && !inString) {
                  inString = true;
                  parenCount = 1;
                } else if (char === ')' && inString) {
                  parenCount--;
                  if (parenCount === 0) {
                    inString = false;
                    if (textContent.trim()) {
                      lines.push(textContent.trim());
                      textContent = '';
                    }
                  }
                } else if (char === '(' && inString) {
                  parenCount++;
                  if (byte >= 32 && byte <= 126) {
                    textContent += char;
                  }
                } else if (inString && parenCount > 0) {
                  if (byte >= 32 && byte <= 126) {
                    textContent += char;
                  } else if (byte === 10 || byte === 13) {
                    textContent += ' ';
                  }
                } else if (char === 'E' && uint8Array[i + 1] === 84) { // "ET" - End Text
                  break;
                }
                i++;
              }
            } else {
              i++;
            }
          }
          
          // Join lines and preserve structure
          text = lines.join('\n');
          text = cleanAndFormatText(text);
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Enhanced DOCX extraction with formatting preservation
  const extractDOCXText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          const decoder = new TextDecoder('utf-8');
          const content = decoder.decode(uint8Array);
          
          // Extract text with paragraph structure
          const paragraphs: string[] = [];
          
          // Look for paragraph tags
          const pTagPattern = /<w:p[^>]*>(.*?)<\/w:p>/gs;
          const pMatches = content.match(pTagPattern);
          
          if (pMatches) {
            pMatches.forEach(pMatch => {
              // Extract text from runs within paragraph
              const textPattern = /<w:t[^>]*>([^<]*)<\/w:t>/g;
              let match;
              let paragraphText = '';
              
              while ((match = textPattern.exec(pMatch)) !== null) {
                if (match[1]) {
                  paragraphText += match[1];
                }
              }
              
              if (paragraphText.trim()) {
                paragraphs.push(paragraphText.trim());
              }
            });
          }
          
          let text = paragraphs.join('\n');
          text = cleanAndFormatText(text);
          
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read DOCX file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Clean and format extracted text while preserving structure
  const cleanAndFormatText = (text: string): string => {
    let cleanText = text;
    
    // Remove excessive whitespace but preserve line breaks
    cleanText = cleanText.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
    cleanText = cleanText.replace(/\n[ \t]+/g, '\n'); // Remove leading spaces on new lines
    cleanText = cleanText.replace(/[ \t]+\n/g, '\n'); // Remove trailing spaces before new lines
    
    // Preserve section breaks and important formatting
    cleanText = cleanText.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive line breaks
    
    // Fix common formatting issues
    cleanText = cleanText.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space before capital letters
    cleanText = cleanText.replace(/(\d{2}\/\d{4}|\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4}|\w+)/g, '$1 - $2'); // Fix date ranges
    cleanText = cleanText.replace(/•\s*/g, '• '); // Ensure space after bullets
    cleanText = cleanText.replace(/\s*•\s*/g, '\n• '); // Bullets on new lines
    
    // Preserve email and phone formatting
    cleanText = cleanText.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '\n$1\n');
    cleanText = cleanText.replace(/(\(?\+?[\d\s\-\(\)]{10,})/g, '\n$1\n');
    
    // Remove extra line breaks around contact info
    cleanText = cleanText.replace(/\n{2,}(@|\()/g, '\n$1');
    cleanText = cleanText.replace(/(@[^\n]+)\n{2,}/g, '$1\n');
    
    return cleanText.trim();
  };

  // Main text extraction function
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Extracting text from file:', file.name, 'Type:', file.type);
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file...');
        text = await extractPDFText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing DOCX file...');
        text = await extractDOCXText(file);
      } else if (file.type === 'text/plain') {
        console.log('Processing text file...');
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else {
        console.log('Processing generic file...');
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = (e.target?.result as string) || '';
              const cleanText = cleanAndFormatText(content);
              resolve(cleanText);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
      
      console.log('Extracted text length:', text.length);
      console.log('Text preview:', text.substring(0, 300));
      
      if (!text || text.length < 10) {
        throw new Error('Could not extract readable text from the file. Please ensure the file contains text content and try again.');
      }
      
      return text;
    } catch (error) {
      console.error('Text extraction failed:', error);
      throw new Error(`Failed to extract text from ${file.type || 'file'}. The file might be corrupted or in an unsupported format.`);
    }
  };

  // Parse extracted text and extract structured data - preserving ALL original information
  const parseExtractedText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Enhanced parsing logic
    const data = {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        website: '',
        linkedin: '',
        github: ''
      },
      experience: [] as any[],
      education: [] as any[],
      skills: [] as string[],
      certifications: [] as any[],
      languages: [] as any[],
      interests: [] as string[],
      projects: [] as any[],
      references: [] as any[]
    };

    let currentSection = '';
    let tempText = '';

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Extract personal information
      if (index < 10) { // First few lines usually contain personal info
        const emailMatch = trimmedLine.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phoneMatch = trimmedLine.match(/[\+]?[\d\s\-\(\)]{10,}/);
        
        if (emailMatch && !data.personal.email) {
          data.personal.email = emailMatch[0];
        }
        
        if (phoneMatch && !data.personal.phone) {
          data.personal.phone = phoneMatch[0].trim();
        }
        
        // First non-email, non-phone line is likely the name
        if (!data.personal.fullName && !emailMatch && !phoneMatch && 
            trimmedLine.length > 3 && !trimmedLine.includes('•') &&
            /^[A-Za-z\s]+$/.test(trimmedLine)) {
          data.personal.fullName = trimmedLine;
        }
      }

      // Section detection
      const sectionKeywords = {
        experience: ['experience', 'work', 'employment', 'career', 'professional'],
        education: ['education', 'academic', 'qualification', 'degree', 'university', 'college'],
        skills: ['skills', 'competencies', 'abilities', 'technical'],
        projects: ['projects', 'portfolio'],
        certifications: ['certifications', 'certificates', 'licenses'],
        languages: ['languages', 'linguistic'],
        interests: ['interests', 'hobbies', 'personal']
      };

      const lowerLine = trimmedLine.toLowerCase();
      
      Object.entries(sectionKeywords).forEach(([section, keywords]) => {
        if (keywords.some(keyword => lowerLine.includes(keyword)) && 
            trimmedLine.length < 50 && !trimmedLine.includes('@')) {
          currentSection = section;
          tempText = '';
        }
      });

      // Parse based on current section
      if (currentSection === 'experience' && trimmedLine.includes('•')) {
        // This is likely a job description point
        tempText += trimmedLine + '\n';
      } else if (currentSection === 'experience' && 
                 (trimmedLine.match(/\d{4}/) || trimmedLine.includes('-')) &&
                 !trimmedLine.includes('•')) {
        // This might be a new job entry
        if (tempText.trim()) {
          const exp = parseExperienceEntry(tempText);
          if (exp) data.experience.push(exp);
        }
        tempText = trimmedLine + '\n';
      } else if (currentSection === 'skills' && trimmedLine) {
        // Extract skills
        const skillLine = trimmedLine.replace(/•/g, '').trim();
        const skills = skillLine.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1);
        data.skills.push(...skills);
      } else if (currentSection) {
        tempText += trimmedLine + '\n';
      }

      // Summary detection (usually appears early)
      if (index < 20 && trimmedLine.length > 50 && 
          !data.personal.summary && 
          !trimmedLine.includes('@') && 
          !trimmedLine.includes('•')) {
        data.personal.summary = trimmedLine;
      }
    });

    // Clean up and finalize
    data.skills = [...new Set(data.skills)].filter(skill => skill.length > 1);
    
    return data;
  };

  const parseExperienceEntry = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return null;

    const firstLine = lines[0];
    const dateMatch = firstLine.match(/(\d{2}\/\d{4}|\d{4})\s*-\s*(\d{2}\/\d{4}|\d{4}|present|current)/i);
    
    return {
      id: Date.now() + Math.random(),
      company: extractCompanyFromLine(firstLine),
      position: extractPositionFromLine(firstLine),
      location: extractLocationFromLine(firstLine),
      duration: dateMatch ? dateMatch[0] : '',
      description: lines.slice(1).join('\n').trim()
    };
  };

  const extractCompanyFromLine = (line: string): string => {
    // Simple heuristic to extract company name
    const parts = line.split(/\s+/);
    return parts.slice(0, 3).join(' ').replace(/[^\w\s]/g, '').trim();
  };

  const extractPositionFromLine = (line: string): string => {
    // Look for position indicators
    const positionKeywords = ['officer', 'manager', 'engineer', 'developer', 'analyst', 'coordinator'];
    const words = line.toLowerCase().split(/\s+/);
    
    for (let keyword of positionKeywords) {
      const index = words.findIndex(word => word.includes(keyword));
      if (index !== -1) {
        return words.slice(Math.max(0, index - 2), index + 1).join(' ');
      }
    }
    
    return 'Professional';
  };

  const extractLocationFromLine = (line: string): string => {
    // Look for location patterns
    const locationMatch = line.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/);
    return locationMatch ? locationMatch[0] : '';
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsExtracting(true);
    
    try {
      console.log('Starting text extraction...');
      const text = await extractTextFromFile(selectedFile);
      setExtractedText(text);
      
      console.log('Parsing extracted text...');
      const parsedData = parseExtractedText(text);
      setExtractedData(parsedData);
      setShowTemplate(true);
      
      toast.success('CV data extracted successfully!');
    } catch (error: any) {
      console.error('Extraction error:', error);
      toast.error(error.message || 'Failed to extract CV data');
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const handleSave = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      toast.success('CV data saved to resume builder!');
    }
  };

  const handleDownload = () => {
    if (extractedData) {
      const dataStr = JSON.stringify(extractedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cv-data.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('CV data downloaded!');
    }
  };

  if (showTemplate && extractedData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                CV Template Editor
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowTemplate(false)}>
                  Back to Upload
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <EditableCVTemplate
              data={extractedData}
              onDataChange={setExtractedData}
              onSave={handleSave}
              onDownload={handleDownload}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Enhanced CV Data Extractor
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your CV to extract, edit, and enhance your data with AI assistance
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <input {...getInputProps()} />
            
            {isExtracting ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Extracting CV Data...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we process your document
                  </p>
                </div>
              </div>
            ) : file ? (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    File Ready for Processing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop or click to select your CV file
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Supports PDF, DOCX, DOC, and TXT files (max 10MB)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {file && !isExtracting && (
              <Button onClick={() => onDrop([file])}>
                <FileText className="w-4 h-4 mr-2" />
                Process CV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVDataExtractor;
