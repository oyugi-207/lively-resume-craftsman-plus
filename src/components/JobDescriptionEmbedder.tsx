
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface JobDescriptionEmbedderProps {
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
  onOptimize?: () => void;
}

const JobDescriptionEmbedder: React.FC<JobDescriptionEmbedderProps> = ({
  jobDescription,
  onJobDescriptionChange,
  onOptimize
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setAnalyzing(true);
    try {
      // Extract keywords and requirements
      const keywords = extractKeywords(jobDescription);
      const requirements = extractRequirements(jobDescription);
      
      toast.success(`Found ${keywords.length} key terms and ${requirements.length} requirements for ATS optimization`);
      
      if (onOptimize) {
        onOptimize();
      }
    } catch (error) {
      toast.error('Failed to analyze job description');
    } finally {
      setAnalyzing(false);
    }
  };

  const extractKeywords = (text: string): string[] => {
    // Simple keyword extraction logic
    const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'will', 'can', 'has', 'have', 'had', 'this', 'that', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'all', 'any', 'some', 'more', 'most', 'other', 'such', 'than', 'very', 'just', 'only', 'also', 'even', 'well', 'back', 'still', 'way', 'new', 'old', 'good', 'great', 'first', 'last', 'long', 'own', 'over', 'think', 'time', 'work', 'life', 'day', 'year', 'may', 'come', 'its', 'now', 'people', 'take', 'get', 'use', 'her', 'him', 'his', 'she', 'see', 'go']);
    
    const uniqueWords = [...new Set(words)].filter(word => 
      !commonWords.has(word) && word.length > 3
    );
    
    return uniqueWords.slice(0, 20);
  };

  const extractRequirements = (text: string): string[] => {
    const requirements: string[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^[•\-\*]/) || trimmedLine.toLowerCase().includes('requirement') || trimmedLine.toLowerCase().includes('must have')) {
        requirements.push(trimmedLine);
      }
    });
    
    return requirements.slice(0, 10);
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-orange-600" />
            ATS Job Description Embedder
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={jobDescription ? "default" : "secondary"} className="text-xs">
              {jobDescription ? "Active" : "Inactive"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="h-6 w-6 p-0"
            >
              {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isVisible && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Job Description (Hidden in PDF for ATS)
            </label>
            <Textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste the full job description here. This will be embedded invisibly in your PDF to improve ATS matching while keeping your resume clean and professional."
              className="min-h-[120px] text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={analyzeJobDescription}
              disabled={analyzing || !jobDescription.trim()}
              size="sm"
              className="flex items-center gap-2"
            >
              <Zap className="w-3 h-3" />
              {analyzing ? 'Analyzing...' : 'Analyze for ATS'}
            </Button>
            
            {jobDescription && (
              <Badge variant="outline" className="text-xs">
                {jobDescription.length} characters
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>How it works:</strong> The job description is embedded as invisible text in your PDF. 
            ATS systems can detect these keywords and requirements, improving your match score, 
            while keeping your resume visually clean and professional.
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default JobDescriptionEmbedder;
