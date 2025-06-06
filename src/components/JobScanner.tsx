
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search, MapPin, Clock, DollarSign, Building, ExternalLink, Zap } from 'lucide-react';

interface JobScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onJobSelected: (job: any) => void;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  link: string;
}

const JobScanner: React.FC<JobScannerProps> = ({ isOpen, onClose, onJobSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Mock job data for demonstration - in real app, integrate with job APIs
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $180,000',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'We are looking for a Senior Software Engineer to join our growing team...',
      requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
      link: 'https://example.com/job/1'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$80,000 - $120,000',
      type: 'Full-time',
      posted: '1 day ago',
      description: 'Join our innovative team as a Frontend Developer...',
      requirements: ['React', 'CSS', 'HTML', 'JavaScript', 'Git'],
      link: 'https://example.com/job/2'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'MegaCorp',
      location: 'New York, NY',
      salary: '$100,000 - $150,000',
      type: 'Full-time',
      posted: '3 days ago',
      description: 'We need a Full Stack Developer with experience in modern web technologies...',
      requirements: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker'],
      link: 'https://example.com/job/3'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredJobs = mockJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setJobs(filteredJobs);
      setLoading(false);
      toast.success(`Found ${filteredJobs.length} jobs matching your search`);
    }, 1500);
  };

  const handleJobSelect = (job: Job) => {
    onJobSelected(job);
    toast.success(`Applied requirements from ${job.title} at ${job.company}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Search className="w-5 h-5" />
            Job Market Scanner
          </DialogTitle>
          <DialogDescription>
            Search for jobs and automatically apply their requirements to your resume
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Form */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="search">Job Title or Keywords</Label>
                  <Input
                    id="search"
                    placeholder="e.g., Software Engineer, Frontend Developer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, Remote..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full mt-4"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scanning Jobs...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Jobs
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Job Results */}
          {jobs.length > 0 && (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.posted}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                      
                      <div className="mb-3">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Key Requirements
                        </Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleJobSelect(job)}
                          className="flex items-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          Apply to Resume
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(job.link, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Job
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* No Results */}
          {!loading && jobs.length === 0 && searchQuery && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No jobs found for your search criteria</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or locations</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobScanner;
