
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface InterestsFormProps {
  data: string[];
  onChange: (data: string[]) => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({ data, onChange }) => {
  const [newInterest, setNewInterest] = useState('');

  const addInterest = () => {
    if (newInterest.trim() && !data.includes(newInterest.trim())) {
      onChange([...data, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    onChange(data.filter(interest => interest !== interestToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests & Hobbies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest (e.g., Photography, Travel, etc.)"
            onKeyPress={handleKeyPress}
          />
          <Button onClick={addInterest}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.map((interest) => (
            <Badge key={interest} variant="secondary" className="flex items-center gap-1">
              {interest}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeInterest(interest)}
              />
            </Badge>
          ))}
        </div>
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No interests added yet. Start typing to add your interests.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterestsForm;
