
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Users, User, Building, Mail, Phone, UserCheck } from 'lucide-react';

interface Reference {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

interface ReferencesFormEnhancedProps {
  data: Reference[];
  onChange: (data: Reference[]) => void;
}

const relationshipTypes = [
  'Former Supervisor',
  'Current Supervisor',
  'Former Colleague',
  'Current Colleague',
  'Client',
  'Mentor',
  'Professor',
  'Business Partner'
];

const ReferencesFormEnhanced: React.FC<ReferencesFormEnhancedProps> = ({ data, onChange }) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">References</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add professional references</p>
          </div>
        </div>
        <Button onClick={addReference} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </Button>
      </div>

      {data.map((ref, index) => (
        <Card key={ref.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-800 dark:to-cyan-950/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <CardHeader className="relative pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-700 dark:text-cyan-300 font-bold text-sm">{index + 1}</span>
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Reference {index + 1}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeReference(ref.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                  placeholder="John Smith"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Job Title
                </Label>
                <Input
                  value={ref.title}
                  onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                  placeholder="Senior Manager"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company
                </Label>
                <Input
                  value={ref.company}
                  onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                  placeholder="Tech Corporation"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
                <Select value={ref.relationship} onValueChange={(value) => updateReference(ref.id, 'relationship', value)}>
                  <SelectTrigger className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={ref.email}
                  onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                  placeholder="john.smith@company.com"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-blue-50/50">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No references added yet</h3>
            <p className="text-sm text-gray-600 mb-4">Click "Add Reference" to include professional references</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferencesFormEnhanced;
