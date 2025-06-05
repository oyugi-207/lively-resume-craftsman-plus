
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

interface CertificationsFormProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    };
    onChange([...data, newCert]);
  };

  const updateCertification = (id: number, field: keyof Certification, value: string) => {
    onChange(data.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
  };

  const removeCertification = (id: number) => {
    onChange(data.filter(cert => cert.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Certifications
          <Button onClick={addCertification} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((cert) => (
          <div key={cert.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Certification {data.indexOf(cert) + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCertification(cert.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <Label>Issuing Organization</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  placeholder="Jan 2023"
                />
              </div>
              <div>
                <Label>Credential ID</Label>
                <Input
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="ABC123XYZ"
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No certifications added yet. Click "Add Certification" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationsForm;
