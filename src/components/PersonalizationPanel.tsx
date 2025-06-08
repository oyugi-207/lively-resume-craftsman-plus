
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save, User } from 'lucide-react';

interface Preferences {
  theme: string;
  defaultTemplate: number;
  autoSave: boolean;
  notifications: boolean;
  language: string;
}

const PersonalizationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'light',
    defaultTemplate: 0,
    autoSave: true,
    notifications: true,
    language: 'en'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Load from localStorage for now
      const stored = localStorage.getItem('user_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('user_preferences', JSON.stringify(preferences));
      
      toast({
        title: "Success",
        description: "Preferences saved successfully"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof Preferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personalization</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={preferences.theme} 
                onValueChange={(value) => updatePreference('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTemplate">Default Template</Label>
              <Select 
                value={preferences.defaultTemplate.toString()} 
                onValueChange={(value) => updatePreference('defaultTemplate', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Modern Professional</SelectItem>
                  <SelectItem value="1">Executive Leadership</SelectItem>
                  <SelectItem value="2">Classic Corporate</SelectItem>
                  <SelectItem value="3">Creative Designer</SelectItem>
                  <SelectItem value="4">Tech Specialist</SelectItem>
                  <SelectItem value="5">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => updatePreference('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Save</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically save changes as you type
                </p>
              </div>
              <Switch 
                checked={preferences.autoSave}
                onCheckedChange={(checked) => updatePreference('autoSave', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications about updates
                </p>
              </div>
              <Switch 
                checked={preferences.notifications}
                onCheckedChange={(checked) => updatePreference('notifications', checked)}
              />
            </div>
          </div>

          <Button 
            onClick={savePreferences} 
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizationPanel;
