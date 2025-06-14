
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Search, 
  FileText, 
  Palette, 
  Wand2, 
  Download, 
  Save,
  Crown,
  Shield,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BuilderHeaderProps {
  selectedTemplate: number;
  atsScore: number;
  saving: boolean;
  importingProfile: boolean;
  onShowCVParser: () => void;
  onImportProfile: () => void;
  onShowJobScanner: () => void;
  onShowJobParser: () => void;
  onShowTemplateSelector: () => void;
  onAIOptimize: () => void;
  onDownloadPDF: () => void;
  onSave: () => void;
}

const getTemplateName = (index: number): string => {
  const names = [
    'Modern Professional',     // 0
    'Executive Leadership',    // 1  
    'Creative Designer',       // 2
    'Tech Specialist',         // 3
    'Minimalist Clean',        // 4
    'Corporate Classic',       // 5
    'Professional Blue',       // 6
    'Legal Professional',      // 7
    'Engineering Focus',       // 8
    'Data Specialist',         // 9
    'Supply Chain Manager',    // 10
    'Clean Modern',            // 11
    'Marketing Creative',      // 12
    'Academic Scholar',        // 13
    'Sales Champion',          // 14
    'Consulting Elite'         // 15
  ];
  return names[index] || 'Modern Professional';
};

const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  selectedTemplate,
  atsScore,
  saving,
  importingProfile,
  onShowCVParser,
  onImportProfile,
  onShowJobScanner,
  onShowJobParser,
  onShowTemplateSelector,
  onAIOptimize,
  onDownloadPDF,
  onSave
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-6 p-6 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 rounded-2xl"></div>
      
      <div className="relative space-y-4">
        {/* Top Row - Navigation and Title */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:bg-blue-50 border-blue-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder Pro
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-Powered Professional Resume Creator
              </p>
            </div>
          </div>
        </div>
        
        {/* Template Info Bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Template: {getTemplateName(selectedTemplate)}
              </h3>
              <p className="text-sm text-gray-600">
                Template {selectedTemplate + 1} - Professional design with excellent ATS compatibility
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              ATS Score: {atsScore}%
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Enhanced
            </Badge>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={onShowCVParser}
            className="flex items-center gap-2 hover:bg-green-50 border-green-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload CV
          </Button>
          
          <Button
            variant="outline"
            onClick={onImportProfile}
            disabled={importingProfile}
            className="flex items-center gap-2 hover:bg-indigo-50 border-indigo-200 transition-colors"
          >
            {importingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <User className="w-4 h-4" />
            )}
            Import Profile
          </Button>
          
          <Button
            variant="outline"
            onClick={onShowJobScanner}
            className="flex items-center gap-2 hover:bg-green-50 border-green-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            Job Scanner
          </Button>
          
          <Button
            variant="outline"
            onClick={onShowJobParser}
            className="flex items-center gap-2 hover:bg-orange-50 border-orange-200 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Job Parser
          </Button>
          
          <Button
            variant="outline"
            onClick={onShowTemplateSelector}
            className="flex items-center gap-2 hover:bg-purple-50 border-purple-200 transition-colors"
          >
            <Palette className="w-4 h-4" />
            Templates
          </Button>
          
          <Button
            onClick={onAIOptimize}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all"
          >
            <Wand2 className="w-4 h-4" />
            AI Optimize
          </Button>
          
          <Button
            onClick={onDownloadPDF}
            variant="outline"
            className="flex items-center gap-2 hover:bg-green-50 border-green-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          
          <Button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderHeader;
