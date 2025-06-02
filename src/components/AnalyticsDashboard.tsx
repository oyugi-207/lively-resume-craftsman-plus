
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Star, Calendar, Target, Award, Briefcase } from 'lucide-react';

interface AnalyticsDashboardProps {
  resumeId?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ resumeId }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [skillMarketData, setSkillMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
      loadApplications();
      loadSkillMarketData();
    }
  }, [user, resumeId]);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('application_date', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadSkillMarketData = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_market_data')
        .select('*')
        .order('demand_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSkillMarketData(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading skill data:', error);
      setLoading(false);
    }
  };

  const getSuccessRate = () => {
    const successful = applications.filter(app => 
      app.status === 'interview' || app.status === 'accepted'
    ).length;
    return applications.length > 0 ? (successful / applications.length) * 100 : 0;
  };

  const getCallbackRate = () => {
    const callbacks = applications.filter(app => 
      app.status !== 'applied' && app.status !== 'rejected'
    ).length;
    return applications.length > 0 ? (callbacks / applications.length) * 100 : 0;
  };

  const applicationsByStatus = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(applicationsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count as number
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getSuccessRate().toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Callback Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCallbackRate().toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CV Views</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.filter(a => a.event_type === 'view').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Application Tracking</TabsTrigger>
          <TabsTrigger value="skills">Skill Market Analysis</TabsTrigger>
          <TabsTrigger value="performance">CV Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No application data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{app.position_title}</h4>
                        <p className="text-sm text-gray-600">{app.company_name}</p>
                      </div>
                      <Badge variant={
                        app.status === 'accepted' ? 'default' :
                        app.status === 'interview' ? 'secondary' :
                        app.status === 'rejected' ? 'destructive' : 'outline'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top In-Demand Skills</CardTitle>
              <CardDescription>Market demand and salary insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillMarketData.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{skill.skill_name}</h4>
                        <Badge variant={
                          skill.growth_trend === 'growing' ? 'default' :
                          skill.growth_trend === 'stable' ? 'secondary' : 'outline'
                        }>
                          {skill.growth_trend}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Demand: {skill.demand_score}%</span>
                        <span>
                          Salary: ${skill.salary_range?.min?.toLocaleString()} - ${skill.salary_range?.max?.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={skill.demand_score} className="mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CV Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.filter(a => a.event_type === 'download').length}
                  </div>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.filter(a => a.event_type === 'view').length}
                  </div>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {(getCallbackRate() / 10).toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Effectiveness Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
