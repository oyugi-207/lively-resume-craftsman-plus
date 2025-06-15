
import React from 'react';
import EnhancedCVUploadEditor from './ai-cv-editor/EnhancedCVUploadEditor';

interface CVUploadEditorProps {
  onClose: () => void;
}

const CVUploadEditor: React.FC<CVUploadEditorProps> = ({ onClose }) => {
  return <EnhancedCVUploadEditor onClose={onClose} />;
};

export default CVUploadEditor;
