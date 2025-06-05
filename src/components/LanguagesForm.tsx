
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface Language {
  id: number;
  language: string;
  proficiency: string;
}

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange }) => {
  const proficiencyLevels = ['Basic', 'Conversational', 'Fluent', 'Native'];

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now(),
      language: '',
      proficiency: 'Basic'
    };
    onChange([...data, newLang]);
  };

  const updateLanguage = (id: number, field: keyof Language, value: string) => {
    onChange(data.map(lang => lang.id === id ? { ...lang, [field]: value } : lang));
  };

  const removeLanguage = (id: number) => {
    onChange(data.filter(lang => lang.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Languages
          <Button onClick={addLanguage} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((lang) => (
          <div key={lang.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Language {data.indexOf(lang) + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Language</Label>
                <Input
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  placeholder="English, Spanish, etc."
                />
              </div>
              <div>
                <Label>Proficiency Level</Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No languages added yet. Click "Add Language" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesForm;
