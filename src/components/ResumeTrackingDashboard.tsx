
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Send, BarChart3, Copy, ExternalLink, FileText, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrackingData {
  id: string;
  recipient_email: string;
  subject: string;
  sent_at: string | null;
  opened_at?: string | null;
  downloaded_at?: string | null;
  status: string | null;
  tracking_url: string;
  attachments?: { name: string; url: string }[];
}

const ResumeTrackingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [attachmentLinks, setAttachmentLinks] = useState<string[]>(['']);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTrackingData();
  }, []);

  const loadTrackingData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resume_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setTrackingData(data || []);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  };

  const generateTrackingId = () => {
    // Proper UUID
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleFileInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      setAttachmentFiles(Array.from(evt.target.files));
    }
  };

  const handleLinkChange = (idx: number, val: string) => {
    setAttachmentLinks(links => {
      const next = [...links];
      next[idx] = val;
      return next;
    });
  };

  const addAttachmentLink = () => setAttachmentLinks([...attachmentLinks, '']);

  const uploadAttachments = async (trackingId: string): Promise<{ name: string; url: string }[]> => {
    setUploading(true);
    const uploaded: { name: string; url: string }[] = [];

    // Only if files exist
    for (const file of attachmentFiles) {
      // We'll use Supabase Storage - you must have a 'attachments' bucket; if you don't, let us know to create one.
      const path = `${trackingId}/${file.name}`;
      const { data, error } = await supabase.storage.from('attachments').upload(path, file, { upsert: true });
      if (error) {
        toast.error(`File upload failed: ${error.message}`);
        setUploading(false);
        return [];
      }
      // Construct public URL (assumes bucket is public)
      const url = supabase.storage.from('attachments').getPublicUrl(path).data.publicUrl;
      uploaded.push({ name: file.name, url });
    }

    // Add links if provided
    attachmentLinks.forEach(link => {
      if (link && link.trim().length > 0) uploaded.push({ name: `Link`, url: link.trim() });
    });

    setUploading(false);
    return uploaded;
  };

  const createEmailTemplate = (attachments: { name: string; url: string }[]) => {
    return `
Subject: Application for ${jobTitle || 'the position'}${companyName ? ` at ${companyName}` : ''}

Dear Hiring Manager,

${customMessage || `Please find my resume and attachments below.`}

Attachments/Links:
${attachments.map(a => `- ${a.name}: ${a.url}`).join('\n')}

Thank you for considering my application.

Best regards,
${user?.email}
    `.trim();
  };

  const sendTrackedResume = async () => {
    if (!recipientEmail || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const trackingId = generateTrackingId();
      const trackingUrl = `${window.location.origin}/track/${trackingId}`;
      // upload files/links
      const attachments = await uploadAttachments(trackingId);

      // Call edge function to send email with tracking (add attachments as info in body, file upload/public links/references)
      const { data, error } = await supabase.functions.invoke('send-tracked-resume', {
        body: {
          recipientEmail,
          subject: `Application for ${jobTitle}${companyName ? ` at ${companyName}` : ''}`,
          emailContent: createEmailTemplate(attachments),
          trackingId,
          trackingUrl,
          attachments
        }
      });

      if (error) throw error;

      // Save record
      const { error: trackingError } = await supabase
        .from('resume_tracking')
        .insert([{
          id: trackingId,
          user_id: user.id,
          recipient_email: recipientEmail,
          subject: `Application for ${jobTitle}${companyName ? ` at ${companyName}` : ''}`,
          email_content: createEmailTemplate(attachments),
          tracking_url: trackingUrl,
          sent_at: new Date().toISOString(),
          status: 'sent'
        }]);

      if (trackingError) throw trackingError;

      toast.success('Resume and files sent successfully with tracking!');
      setRecipientEmail('');
      setJobTitle('');
      setCompanyName('');
      setCustomMessage('');
      setAttachmentFiles([]);
      setAttachmentLinks(['']);
      loadTrackingData();
    } catch (error: any) {
      console.error('Error sending tracked resume:', error);
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Tracking URL copied to clipboard');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Resume Tracking & Email Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Send Application</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient Email *</label>
                  <Input
                    type="email"
                    placeholder="hiring@company.com"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <Input
                    placeholder="Software Engineer"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    placeholder="Company Inc."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Custom Message</label>
                  <Textarea
                    placeholder="Custom message..."
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attach CV/Cover Letter (PDF, DOC, etc)</label>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                  />
                  {attachmentFiles.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Files: {attachmentFiles.map(f => f.name).join(', ')}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attachment Links</label>
                  {attachmentLinks.map((link, idx) => (
                    <div className="flex items-center gap-1 mb-1" key={idx}>
                      <Input
                        placeholder="Paste link (Google Drive, Dropbox, etc)..."
                        value={link}
                        onChange={e => handleLinkChange(idx, e.target.value)}
                      />
                      {idx === attachmentLinks.length - 1 && (
                        <Button size="icon" variant="ghost" type="button" onClick={addAttachmentLink}>
                          <Link2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 mt-3"
                  disabled={loading || uploading}
                  onClick={sendTrackedResume}
                >
                  {loading || uploading ? 'Sending...' : 'Send with Tracking'}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Preview Email</h3>
                <div className="bg-gray-50 p-4 rounded-lg border text-sm min-h-[200px]">
                  <strong>To:</strong> {recipientEmail || '[recipient]'}<br />
                  <strong>Subject:</strong> Application for {jobTitle || '[Job Title]'}{companyName ? ` at ${companyName}` : ''}<br />
                  <strong>Message:</strong>
                  <div className="whitespace-pre-line text-xs border-t pt-2 mt-2">
                    {createEmailTemplate(attachmentLinks.filter(Boolean).map(link => ({ name: 'Link', url: link })))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingData.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                No tracked resumes yet.
              </div>
            )}
            {trackingData.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.status === 'opened' ? <Eye className="w-4 h-4 text-orange-500" /> : item.status === 'downloaded' ? <Download className="w-4 h-4 text-green-500" /> : <Send className="w-4 h-4 text-blue-500" />}
                    <div>
                      <div className="font-medium">{item.recipient_email}</div>
                      <div className="text-sm text-gray-600">{item.subject}</div>
                    </div>
                  </div>
                  <Badge>{item.status?.toUpperCase() || 'SENT'}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => copyTrackingUrl(item.tracking_url)}>
                    <Copy className="w-4 h-4" />Copy Tracking Link
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(item.tracking_url, '_blank')}>
                    <ExternalLink className="w-4 h-4" />Open Tracking
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeTrackingDashboard;
