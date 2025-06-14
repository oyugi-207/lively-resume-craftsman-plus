
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { PDFGenerator } from "./pdf-generator.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackedEmailRequest {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  emailContent: string;
  resumeData: any;
  trackingId: string;
  trackingUrl: string;
  senderName: string;
  senderEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      recipientEmail,
      recipientName,
      subject,
      emailContent,
      resumeData,
      trackingId,
      trackingUrl,
      senderName,
      senderEmail
    }: TrackedEmailRequest = await req.json();

    console.log("Sending tracked resume email:", { recipientEmail, subject, trackingId });

    // Generate PDF resume
    const pdfBuffer = await PDFGenerator.generatePDFBuffer(resumeData);

    // Create tracking pixel HTML
    const trackingPixel = `<img src="${trackingUrl}/pixel.png" width="1" height="1" style="display:none;" />`;
    
    // Enhanced HTML email with tracking
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="white-space: pre-line;">${emailContent}</div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
          <h3 style="color: #495057; margin-bottom: 15px;">📄 Resume Attached</h3>
          <p style="color: #6c757d; margin-bottom: 20px;">Please find my resume attached to this email for your review.</p>
          <a href="${trackingUrl}/download" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            📥 Download Resume
          </a>
          <p style="font-size: 12px; color: #868e96; margin-top: 15px;">
            Click the button above to download the latest version of my resume.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center;">
          <p>This email was sent by ${senderName} (${senderEmail})</p>
        </div>
        
        ${trackingPixel}
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Resume Tracker <noreply@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
      text: emailContent,
      attachments: [
        {
          filename: `${senderName.replace(/\s+/g, '_')}_Resume.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      trackingId 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-tracked-resume function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
