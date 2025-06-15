
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Filter,
  Briefcase,
  Zap,
  Star,
  Calendar,
  Users,
  TrendingUp,
  Globe,
  Database,
  AlertCircle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  url: string;
}

interface JobResponse {
  jobs: Job[];
  total: number;
  query: string;
  location: string;
  remote: boolean;
  sources?: string[];
  source?: string;
}

const JobMarket: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [dataSources, setDataSources] = useState<string[]>([]);

  const searchJobs = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-market-api', {
        body: {
          query: searchQuery,
          location: location,
          remote: remoteOnly,
          limit: 25
        }
      });

      if (error) throw error;

      const response: JobResponse = data;
      setJobs(response.jobs || []);
      setTotalJobs(response.total || 0);
      setDataSources(response.sources || []);
      
      if (response.jobs?.length === 0) {
        toast.info('No jobs found matching your criteria. Try different keywords or remove location filters.');
      } else {
        const sourcesList = response.sources?.join(', ') || 'unknown sources';
        const message = response.sources?.includes('Mock') 
          ? `Found ${response.jobs?.length} sample jobs. Add API keys in Settings for live data.`
          : `Found ${response.jobs?.length} live jobs from ${sourcesList}!`;
        toast.success(message);
      }
    } catch (error: any) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search jobs. Please try again.');
      setJobs([]);
      setTotalJobs(0);
      setDataSources([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchJobs();
    }
  };

  const getDataSourceIcon = () => {
    if (dataSources.includes('JSearch') || dataSources.includes('RemoteOK') || dataSources.includes('Adzuna')) {
      return <Globe className="w-4 h-4 text-green-600" />;
    }
    if (dataSources.includes('Mock')) {
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
    return <Database className="w-4 h-4 text-gray-600" />;
  };

  const getDataSourceText = () => {
    if (dataSources.length > 1 && !dataSources.includes('Mock')) {
      return `Live data from ${dataSources.length} sources`;
    }
    if (dataSources.includes('JSearch')) return 'Live data (Indeed, LinkedIn)';
    if (dataSources.includes('RemoteOK')) return 'Live remote jobs';
    if (dataSources.includes('Adzuna')) return 'Live job data';
    if (dataSources.includes('Mock')) return 'Sample data';
    return 'Job data';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Job Market
          </CardTitle>
          <CardDescription className="text-blue-100">
            Search jobs from LinkedIn, Indeed, RemoteOK, and more sources
          </CardDescription>
        </CardHeader>
      </Card>

      {/* API Configuration Notice */}
      {dataSources.includes('Mock') && totalJobs > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Using Sample Data</h4>
                <p className="text-sm text-yellow-700">
                  Configure API keys in Settings to access live job listings from multiple job boards including LinkedIn, Indeed, and specialized remote job sites.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Jobs
          </CardTitle>
          <CardDescription>
            Search across multiple job boards including LinkedIn, Indeed, RemoteOK, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="job-search">Job Title or Keywords</Label>
                <Input
                  id="job-search"
                  placeholder="e.g. Software Engineer, Product Manager, Designer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location-search">Location</Label>
                <Input
                  id="location-search"
                  placeholder="e.g. New York, San Francisco, or leave empty for anywhere"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="remote-only"
                  checked={remoteOnly}
                  onCheckedChange={setRemoteOnly}
                />
                <Label htmlFor="remote-only">Remote jobs only</Label>
              </div>
              
              <Button 
                onClick={searchJobs} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? 'Searching...' : 'Search Jobs'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {totalJobs > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Job Results
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getDataSourceIcon()}
                  {getDataSourceText()}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {totalJobs} jobs found
                </Badge>
              </div>
            </div>
            {dataSources.length > 1 && (
              <CardDescription>
                Results from: {dataSources.filter(s => s !== 'Mock').join(', ')}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {job.company[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {job.title}
                              </h3>
                              {(job as any).source && (
                                <Badge variant="outline" className="text-xs">
                                  {(job as any).source}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {job.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {getTimeAgo(job.posted)}
                              </div>
                              {job.salary && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </div>
                              )}
                            </div>
                            
                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {job.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.remote && (
                                <Badge className="bg-green-100 text-green-800">
                                  Remote
                                </Badge>
                              )}
                              {job.requirements.slice(0, 4).map((req, index) => (
                                <Badge key={index} variant="outline">
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 4 && (
                                <Badge variant="outline">
                                  +{job.requirements.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline">
                          Save Job
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Featured Jobs - Updated for remote focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Featured Remote Opportunities
          </CardTitle>
          <CardDescription>
            Hand-picked remote and hybrid positions from top companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Senior React Developer',
                company: 'Remote Tech Co',
                location: 'Remote Worldwide',
                salary: '$120K - $160K',
                remote: true
              },
              {
                title: 'Product Manager',
                company: 'Global Startup',
                location: 'Remote (US/EU)',
                salary: '$110K - $150K',
                remote: true
              },
              {
                title: 'UI/UX Designer',
                company: 'Design Agency',
                location: 'Remote',
                salary: '$90K - $130K',
                remote: true
              }
            ].map((job, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {job.company[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Globe className="w-3 h-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">{job.salary}</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Remote
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobMarket;
