
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  Brain, 
  FileText, 
  Globe, 
  Users, 
  TrendingUp,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

const LiveFeatures: React.FC = () => {
  const [optimizing, setOptimizing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateAIOptimization = async () => {
    setOptimizing(true);
    setProgress(0);
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setOptimizing(false);
    toast.success('Resume optimized with AI suggestions!');
  };

  const simulateATSAnalysis = async () => {
    setAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnalyzing(false);
    toast.success('ATS compatibility analysis complete!');
  };

  const liveFeatures = [
    {
      id: 1,
      title: 'AI Resume Optimizer',
      description: 'Intelligent content enhancement and optimization',
      icon: Brain,
      status: 'live',
      action: simulateAIOptimization,
      loading: optimizing
    },
    {
      id: 2,
      title: 'ATS Score Analyzer',
      description: 'Real-time ATS compatibility scoring',
      icon: Target,
      status: 'live',
      action: simulateATSAnalysis,
      loading: analyzing
    },
    {
      id: 3,
      title: 'Smart Job Matching',
      description: 'AI-powered job recommendation engine',
      icon: TrendingUp,
      status: 'beta',
      action: () => toast.info('Smart job matching is in beta testing!')
    },
    {
      id: 4,
      title: 'Global Job Market',
      description: 'Access worldwide job opportunities',
      icon: Globe,
      status: 'live',
      action: () => toast.success('Global job market access enabled!')
    },
    {
      id: 5,
      title: 'Team Collaboration',
      description: 'Share and collaborate on resume building',
      icon: Users,
      status: 'preview',
      action: () => toast.info('Team collaboration coming in next update!')
    },
    {
      id: 6,
      title: 'Interview Scheduler',
      description: 'Integrated interview scheduling system',
      icon: Clock,
      status: 'preview',
      action: () => toast.info('Interview scheduler in development!')
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'beta':
        return <Badge className="bg-orange-100 text-orange-800">Beta</Badge>;
      case 'preview':
        return <Badge variant="secondary">Preview</Badge>;
      default:
        return <Badge variant="outline">Coming Soon</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Live Features Dashboard
            <Badge className="bg-blue-100 text-blue-800">
              <Star className="w-3 h-3 mr-1" />
              Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{feature.description}</p>
                    
                    {feature.loading && (
                      <div className="mb-3">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">Processing... {progress}%</p>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      variant={feature.status === 'live' ? 'default' : 'outline'}
                      onClick={feature.action}
                      disabled={feature.loading}
                      className="w-full"
                    >
                      {feature.loading ? 'Processing...' : 
                       feature.status === 'live' ? 'Try Now' : 'Preview'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Quick Resume Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Summary Generator</label>
              <Textarea 
                placeholder="Describe your experience briefly..." 
                className="min-h-[80px]"
              />
              <Button size="sm" className="w-full">
                <Brain className="w-4 h-4 mr-1" />
                Generate AI Summary
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills Optimizer</label>
              <Input placeholder="Enter skills (comma separated)" />
              <Button size="sm" className="w-full">
                <Target className="w-4 h-4 mr-1" />
                Optimize Skills
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Resume Automation Tools
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success('Auto-formatting applied!')}>
                Auto Format
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('Keywords optimized!')}>
                Keyword Boost
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('Length optimized!')}>
                Optimize Length
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('Style enhanced!')}>
                Style Polish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveFeatures;
