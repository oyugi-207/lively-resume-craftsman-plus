
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JobDescriptionParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const JobDescriptionParser: React.FC<JobDescriptionParserProps> = ({
  isOpen,
  onClose,
  onParsed
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleParse = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setParsing(true);
    try {
      const response = await supabase.functions.invoke('parse-job-description', {
        body: { jobDescription }
      });

      if (response.error) throw response.error;

      setParsedData(response.data);
      toast.success('Job description parsed successfully!');
    } catch (error: any) {
      console.error('Job parsing error:', error);
      toast.error('Failed to parse job description');
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (parsedData) {
      onParsed(parsedData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Parse Job Description
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste Job Description
            </label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here. Our AI will extract relevant skills, requirements, and suggest improvements for your resume..."
              className="min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleParse}
            disabled={parsing || !jobDescription.trim()}
            className="w-full flex items-center gap-2"
          >
            {parsing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {parsing ? 'Parsing...' : 'Parse with AI'}
          </Button>

          {parsedData && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Extracted Information</h3>
                
                {parsedData.skills && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {parsedData.requirements && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {parsedData.requirements.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsedData.summary && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Suggested Summary:</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{parsedData.summary}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleApply} className="flex-1">
                    Apply to Resume
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDescriptionParser;
