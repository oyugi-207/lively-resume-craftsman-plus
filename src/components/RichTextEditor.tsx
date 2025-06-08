
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Type,
  Minus
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className = ""
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertBulletPoint = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    // Check if we're at the beginning of a line
    const isAtLineStart = start === 0 || value[start - 1] === '\n';
    
    let newText;
    if (isAtLineStart) {
      newText = beforeCursor + '• ' + afterCursor;
    } else {
      newText = beforeCursor + '\n• ' + afterCursor;
    }
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = isAtLineStart ? start + 2 : start + 3;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertNumberedPoint = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    // Find existing numbered items to determine next number
    const lines = beforeCursor.split('\n');
    let nextNumber = 1;
    
    // Look for existing numbered items
    for (let i = lines.length - 1; i >= 0; i--) {
      const match = lines[i].match(/^(\d+)\.\s/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
        break;
      }
    }
    
    const isAtLineStart = start === 0 || value[start - 1] === '\n';
    
    let newText;
    if (isAtLineStart) {
      newText = beforeCursor + `${nextNumber}. ` + afterCursor;
    } else {
      newText = beforeCursor + `\n${nextNumber}. ` + afterCursor;
    }
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = isAtLineStart ? start + `${nextNumber}. `.length : start + `\n${nextNumber}. `.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertSeparator = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    
    const isAtLineStart = start === 0 || value[start - 1] === '\n';
    
    let newText;
    if (isAtLineStart) {
      newText = beforeCursor + '---\n' + afterCursor;
    } else {
      newText = beforeCursor + '\n---\n' + afterCursor;
    }
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = isAtLineStart ? start + 4 : start + 5;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('**', '**')}
          title="Bold"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertText('*', '*')}
          title="Italic"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertBulletPoint}
          title="Bullet Point"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertNumberedPoint}
          title="Numbered List"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertSeparator}
          title="Separator"
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 rounded-t-none focus:ring-0 min-h-[300px] resize-none"
      />
    </div>
  );
};

export default RichTextEditor;
