
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Crown, 
  Upload, 
  User, 
  Search, 
  FileText, 
  Palette, 
  Wand2, 
  Download, 
  Save, 
  Loader2 
} from 'lucide-react';

interface BuilderHeaderProps {
  saving: boolean;
  importingProfile: boolean;
  onUploadCV: () => void;
  onImportProfile: () => void;
  onJobScan: () => void;
  onJobParse: () => void;
  onTemplateSelect: () => void;
  onAIOptimize: () => void;
  onDownloadPDF: () => void;
  onSave: () => void;
}

const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  saving,
  importingProfile,
  onUploadCV,
  onImportProfile,
  onJobScan,
  onJobParse,
  onTemplateSelect,
  onAIOptimize,
  onDownloadPDF,
  onSave
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 lg:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
      
      <div className="relative flex flex-col gap-3 sm:gap-4">
        {/* Top Row - Navigation and Title */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 sm:gap-2 hover:bg-blue-50 border-blue-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            size="sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-sm sm:text-lg lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder Pro
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm hidden sm:block">
                AI-Powered Professional Resume Creator
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-10 lg:flex lg:flex-wrap gap-1 sm:gap-2">
          <Button
            variant="outline"
            onClick={onUploadCV}
            className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Upload CV</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onImportProfile}
            disabled={importingProfile}
            className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-indigo-50 border-indigo-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            {importingProfile ? (
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="text-xs">Import</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onJobScan}
            className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Scan</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onJobParse}
            className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-orange-50 border-orange-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Parse</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onTemplateSelect}
            className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-purple-50 border-purple-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Style</span>
          </Button>
          
          <Button
            onClick={onAIOptimize}
            className="flex flex-col sm:flex-row items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs shadow-lg px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">AI</span>
          </Button>
          
          <Button
            onClick={onDownloadPDF}
            variant="outline"
            className="flex flex-col sm:flex-row items-center gap-1 text-xs hover:bg-green-50 border-green-200 px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">PDF</span>
          </Button>
          
          <Button
            onClick={onSave}
            disabled={saving}
            className="flex flex-col sm:flex-row items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-lg px-1 sm:px-2 lg:px-3 py-2 min-h-[2.5rem] sm:min-h-0"
            size="sm"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">{saving ? 'Saving...' : 'Save'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuilderHeader;
