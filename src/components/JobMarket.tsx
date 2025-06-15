
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
  AlertCircle,
  Bookmark
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
      let jobResults = response.jobs || [];
      
      // Sort jobs by posted date (latest first)
      jobResults.sort((a, b) => {
        const dateA = new Date(a.posted).getTime();
        const dateB = new Date(b.posted).getTime();
        return dateB - dateA; // Latest first
      });
      
      setJobs(jobResults);
      setTotalJobs(response.total || 0);
      setDataSources(response.sources || []);
      
      if (jobResults.length === 0) {
        toast.info('No jobs found matching your criteria. Try different keywords or remove location filters.');
      } else {
        const sourcesList = response.sources?.join(', ') || 'unknown sources';
        const message = response.sources?.includes('Mock') 
          ? `Found ${jobResults.length} sample jobs. Add API keys in Settings for live data.`
          : `Found ${jobResults.length} live jobs from ${sourcesList}!`;
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

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'JSearch (Indeed/LinkedIn)':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RemoteOK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Adzuna':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Mock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const cleanDescription = (description: string) => {
    // Remove HTML tags and clean up the description
    return description
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <Briefcase className="w-8 h-8" />
            Job Market
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Search jobs from LinkedIn, Indeed, RemoteOK, and more sources
          </CardDescription>
        </CardHeader>
      </Card>

      {/* API Configuration Notice */}
      {dataSources.includes('Mock') && totalJobs > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 shadow-md">
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
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="w-6 h-6 text-blue-600" />
            Search Jobs
          </CardTitle>
          <CardDescription className="text-gray-600">
            Search across multiple job boards including LinkedIn, Indeed, RemoteOK, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="job-search" className="text-sm font-medium text-gray-700">Job Title or Keywords</Label>
                <Input
                  id="job-search"
                  placeholder="e.g. Software Engineer, Product Manager, Designer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-2 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="location-search" className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  id="location-search"
                  placeholder="e.g. New York, San Francisco, or leave empty"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-2 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Switch
                  id="remote-only"
                  checked={remoteOnly}
                  onCheckedChange={setRemoteOnly}
                />
                <Label htmlFor="remote-only" className="text-sm font-medium text-gray-700">Remote jobs only</Label>
              </div>
              
              <Button 
                onClick={searchJobs} 
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-11"
                size="lg"
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
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Job Results
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                  {totalJobs} found
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getDataSourceIcon()}
                  {getDataSourceText()}
                </div>
              </div>
            </div>
            {dataSources.length > 1 && (
              <CardDescription>
                Results from: {dataSources.filter(s => s !== 'Mock').join(', ')}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[700px]">
              <div className="divide-y divide-gray-100">
                {jobs.map((job, index) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-all duration-200 group">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          {/* Company Logo/Initial */}
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                            {job.company[0]?.toUpperCase() || 'C'}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Job Title and Source */}
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h3>
                              {(job as any).source && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs font-medium ${getSourceBadgeColor((job as any).source)}`}
                                >
                                  {(job as any).source}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Company and Location */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1.5">
                                <Building className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{job.company}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{getTimeAgo(job.posted)}</span>
                              </div>
                              {job.salary && job.salary !== 'Salary not specified' && (
                                <div className="flex items-center gap-1.5">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-green-700">{job.salary}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                              {cleanDescription(job.description)}
                            </p>
                            
                            {/* Requirements/Skills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.remote && (
                                <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                                  <Globe className="w-3 h-3 mr-1" />
                                  Remote
                                </Badge>
                              )}
                              {job.requirements.slice(0, 5).map((req, reqIndex) => (
                                <Badge 
                                  key={reqIndex} 
                                  variant="outline" 
                                  className="bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 5 && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  +{job.requirements.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 ml-4">
                        <Button 
                          size="sm" 
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 shadow-sm"
                          onClick={() => window.open(job.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Apply Now
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                        >
                          <Bookmark className="w-4 h-4" />
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

      {/* Featured Jobs */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-6 h-6 text-yellow-500" />
            Featured Remote Opportunities
          </CardTitle>
          <CardDescription>
            Hand-picked remote and hybrid positions from top companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Card key={index} className="border-2 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-lg bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                      {job.company[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">{job.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 font-medium">{job.company}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Globe className="w-3 h-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                        <Badge className="bg-green-100 text-green-800 text-xs border-green-200">
                          <Globe className="w-3 h-3 mr-1" />
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
