
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Palette, Upload, Link, User, Github, Linkedin, Twitter, Globe, Camera } from 'lucide-react';

interface PersonalizationPanelProps {
  onBrandingChange: (branding: any) => void;
}

const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({ onBrandingChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<any>({
    brand_colors: { primary: '#3b82f6', secondary: '#64748b', accent: '#10b981' },
    default_font: 'Inter',
    social_links: {},
    profile_photo: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPreferences(data);
        onBrandingChange(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      onBrandingChange(preferences);
      toast({
        title: "Settings Saved",
        description: "Your personalization preferences have been updated"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBrandColors = (colorType: string, color: string) => {
    setPreferences(prev => ({
      ...prev,
      brand_colors: { ...prev.brand_colors, [colorType]: color }
    }));
  };

  const updateSocialLink = (platform: string, url: string) => {
    setPreferences(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: url }
    }));
  };

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro', 
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Calibri'
  ];

  const colorPresets = [
    { name: 'Blue Professional', primary: '#3b82f6', secondary: '#64748b', accent: '#10b981' },
    { name: 'Corporate Gray', primary: '#374151', secondary: '#9ca3af', accent: '#059669' },
    { name: 'Creative Purple', primary: '#7c3aed', secondary: '#a78bfa', accent: '#f59e0b' },
    { name: 'Modern Teal', primary: '#0d9488', secondary: '#14b8a6', accent: '#f97316' },
    { name: 'Elegant Black', primary: '#1f2937', secondary: '#6b7280', accent: '#3b82f6' },
    { name: 'Tech Green', primary: '#059669', secondary: '#34d399', accent: '#8b5cf6' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Personalization & Branding
          </h3>
          <p className="text-sm text-gray-600">Customize your resume's appearance and integrate your professional profiles</p>
        </div>
        <Button onClick={savePreferences} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding">Brand Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="photo">Profile Photo</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Color Scheme</CardTitle>
              <CardDescription>Choose colors that represent your personal brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={preferences.brand_colors?.primary || '#3b82f6'}
                      onChange={(e) => updateBrandColors('primary', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={preferences.brand_colors?.primary || '#3b82f6'}
                      onChange={(e) => updateBrandColors('primary', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={preferences.brand_colors?.secondary || '#64748b'}
                      onChange={(e) => updateBrandColors('secondary', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={preferences.brand_colors?.secondary || '#64748b'}
                      onChange={(e) => updateBrandColors('secondary', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="accent-color"
                      type="color"
                      value={preferences.brand_colors?.accent || '#10b981'}
                      onChange={(e) => updateBrandColors('accent', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={preferences.brand_colors?.accent || '#10b981'}
                      onChange={(e) => updateBrandColors('accent', e.target.value)}
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Color Presets</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {colorPresets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start"
                      onClick={() => setPreferences(prev => ({ ...prev, brand_colors: preset }))}
                    >
                      <div className="flex gap-1 mb-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-xs">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
              <CardDescription>Choose fonts that match your professional style</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="font-family">Default Font Family</Label>
                <select
                  id="font-family"
                  value={preferences.default_font || 'Inter'}
                  onChange={(e) => setPreferences(prev => ({ ...prev, default_font: e.target.value }))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="mt-4 p-4 border rounded-lg" style={{ fontFamily: preferences.default_font }}>
                  <h4 className="font-semibold">Preview Text</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    This is how your resume text will appear with the selected font family.
                    Professional typography enhances readability and visual appeal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Integration</CardTitle>
              <CardDescription>Connect your professional profiles and portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={preferences.social_links?.linkedin || ''}
                      onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-gray-800" />
                  <div className="flex-1">
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input
                      id="github"
                      value={preferences.social_links?.github || ''}
                      onChange={(e) => updateSocialLink('github', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <Label htmlFor="website">Portfolio Website</Label>
                    <Input
                      id="website"
                      value={preferences.social_links?.website || ''}
                      onChange={(e) => updateSocialLink('website', e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <Label htmlFor="twitter">Twitter Profile</Label>
                    <Input
                      id="twitter"
                      value={preferences.social_links?.twitter || ''}
                      onChange={(e) => updateSocialLink('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Photo</CardTitle>
              <CardDescription>Add a professional headshot to your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={preferences.profile_photo} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">
                    Recommended: Professional headshot, 400x400px minimum, JPG or PNG format
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Photo Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Professional business attire</li>
                  <li>• Clean, neutral background</li>
                  <li>• Good lighting and high resolution</li>
                  <li>• Friendly, confident expression</li>
                  <li>• Face should take up 60-70% of the image</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizationPanel;
