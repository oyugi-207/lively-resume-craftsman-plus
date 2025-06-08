
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Key, 
  Bell, 
  Shield,
  Save,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    marketing: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Load user preferences and settings
    try {
      // For now, we'll use local storage for API keys
      const storedApiKey = localStorage.getItem('gemini_api_key');
      if (storedApiKey) {
        setGeminiApiKey(storedApiKey);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveApiKey = async () => {
    setSaving(true);
    try {
      // Store API key locally for now
      localStorage.setItem('gemini_api_key', geminiApiKey);
      
      toast({
        title: "Success",
        description: "API key saved successfully"
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    if (!geminiApiKey) {
      toast({
        title: "Error",
        description: "Please enter your Gemini API key first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test the API connection
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimize', {
        body: { 
          resumeData: { personal: { summary: "Test connection" } },
          apiKey: geminiApiKey 
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API connection successful!"
      });
    } catch (error: any) {
      console.error('Error testing connection:', error);
      toast({
        title: "Connection Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred color scheme
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                AI Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Required for AI-powered resume optimization and suggestions
                  </p>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="gemini-key"
                        type={showApiKey ? "text" : "password"}
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button 
                      onClick={saveApiKey} 
                      disabled={saving || !geminiApiKey}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
                
                {geminiApiKey && (
                  <Button 
                    variant="outline" 
                    onClick={testConnection}
                    className="w-full"
                  >
                    Test Connection
                  </Button>
                )}
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    How to get your Gemini API key:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy and paste the key here</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about your resumes via email
                  </p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Browser Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Show notifications in your browser
                  </p>
                </div>
                <Switch 
                  checked={notifications.browser}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, browser: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Communications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive tips and product updates
                  </p>
                </div>
                <Switch 
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Data Privacy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your resume data is stored securely and is only accessible by you. 
                  We use industry-standard encryption to protect your information.
                </p>
                <Button variant="outline" size="sm">
                  Download My Data
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Account Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Manage your account security settings and password.
                </p>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
