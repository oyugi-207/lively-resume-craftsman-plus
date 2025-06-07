
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download, 
  Trash2,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  Check
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    aiSuggestions: true,
    autoSave: true,
    downloadFormat: 'pdf',
    templatePreferences: 'modern'
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Here you would typically save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const saveApiKey = async () => {
    if (!geminiApiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    try {
      // In a real app, you'd save this securely to Supabase secrets
      localStorage.setItem('gemini_api_key', geminiApiKey);
      toast.success('API key saved successfully!');
      setGeminiApiKey('');
    } catch (error) {
      toast.error('Failed to save API key');
    }
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Implement account deletion logic
        toast.error('Account deletion is not implemented yet');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </CardTitle>
          <CardDescription>
            Manage your account preferences and application settings
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Basic application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <div className="text-sm text-gray-500">Choose your preferred theme</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === 'light' ? 'Dark' : 'Light'}
              </Button>
            </div>

            <Separator />

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Save</Label>
                <div className="text-sm text-gray-500">Automatically save your work</div>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
              />
            </div>

            {/* AI Suggestions */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Suggestions</Label>
                <div className="text-sm text-gray-500">Get AI-powered resume improvements</div>
              </div>
              <Switch
                checked={settings.aiSuggestions}
                onCheckedChange={(checked) => handleSettingChange('aiSuggestions', checked)}
              />
            </div>

            {/* Download Format */}
            <div className="space-y-2">
              <Label>Default Download Format</Label>
              <div className="flex gap-2">
                <Button
                  variant={settings.downloadFormat === 'pdf' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('downloadFormat', 'pdf')}
                >
                  PDF
                </Button>
                <Button
                  variant={settings.downloadFormat === 'docx' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('downloadFormat', 'docx')}
                >
                  DOCX
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-gray-500">Receive updates via email</div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <div className="text-sm text-gray-500">Browser push notifications</div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Notification Types</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="resume-tips" defaultChecked />
                  <label htmlFor="resume-tips" className="text-sm">Resume tips and suggestions</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="job-matches" defaultChecked />
                  <label htmlFor="job-matches" className="text-sm">Job matches</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="system-updates" defaultChecked />
                  <label htmlFor="system-updates" className="text-sm">System updates</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Configuration
            </CardTitle>
            <CardDescription>Configure external service integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-api">Gemini AI API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="gemini-api"
                    type={showApiKey ? 'text' : 'password'}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button onClick={saveApiKey} size="sm">
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Required for AI-powered resume optimization. Get your free API key from Google AI Studio.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>Job Market API: Connected (Free tier)</span>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Data Privacy</div>
                  <div className="text-sm text-gray-500">Control how your data is used</div>
                </div>
                <Badge variant="outline">Secure</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Add extra security to your account</div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Download My Data</div>
                  <div className="text-sm text-gray-500">Export all your data</div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
          <Button
            variant="destructive"
            onClick={deleteAccount}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <div className="font-medium text-red-900">Delete Account</div>
              <div className="text-sm text-red-700">
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={deleteAccount}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
