
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface Reference {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

interface ReferencesFormProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({ data, onChange }) => {
  const addReference = () => {
    const newRef: Reference = {
      id: Date.now(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    onChange([...data, newRef]);
  };

  const updateReference = (id: number, field: keyof Reference, value: string) => {
    onChange(data.map(ref => ref.id === id ? { ...ref, [field]: value } : ref));
  };

  const removeReference = (id: number) => {
    onChange(data.filter(ref => ref.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          References
          <Button onClick={addReference} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Reference
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((ref) => (
          <div key={ref.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Reference {data.indexOf(ref) + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeReference(ref.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input
                  value={ref.title}
                  onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                  placeholder="Senior Manager"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={ref.company}
                  onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                  placeholder="ABC Corporation"
                />
              </div>
              <div>
                <Label>Relationship</Label>
                <Input
                  value={ref.relationship}
                  onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                  placeholder="Direct Supervisor"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={ref.email}
                  onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                  placeholder="john.smith@company.com"
                  type="email"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={ref.phone}
                  onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No references added yet. Click "Add Reference" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferencesForm;
