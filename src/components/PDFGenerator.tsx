
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number = 12, fontStyle: string = 'normal', maxWidth: number = pageWidth - 2 * margin) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.6;
        });
        yPosition += 3;
      };

      const addSection = (title: string, content: any) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Section title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 8;
        
        // Line under title
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        
        // Section content
        if (typeof content === 'string') {
          addText(content, 11, 'normal');
        } else if (Array.isArray(content)) {
          content.forEach(item => {
            if (typeof item === 'string') {
              addText(`• ${item}`, 11, 'normal');
            } else {
              // Handle objects like experience, education
              Object.keys(item).forEach(key => {
                if (key !== 'id' && item[key]) {
                  addText(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${item[key]}`, 11, 'normal');
                }
              });
              yPosition += 5;
            }
          });
        }
        yPosition += 10;
      };

      // Header with name and contact info
      if (resumeData.personal?.fullName) {
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        const nameWidth = pdf.getTextWidth(resumeData.personal.fullName);
        pdf.text(resumeData.personal.fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 12;

        // Contact info
        const contactInfo = [
          resumeData.personal.email,
          resumeData.personal.phone,
          resumeData.personal.location
        ].filter(Boolean).join(' | ');
        
        if (contactInfo) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const contactWidth = pdf.getTextWidth(contactInfo);
          pdf.text(contactInfo, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 15;
        }
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSection('Professional Summary', resumeData.personal.summary);
      }

      // Experience
      if (resumeData.experience?.length > 0) {
        addSection('Professional Experience', resumeData.experience.map((exp: any) => 
          `${exp.position} at ${exp.company}\n${exp.startDate} - ${exp.endDate}\n${exp.description}`
        ).join('\n\n'));
      }

      // Education
      if (resumeData.education?.length > 0) {
        addSection('Education', resumeData.education.map((edu: any) => 
          `${edu.degree} from ${edu.school}\n${edu.startDate} - ${edu.endDate}`
        ).join('\n\n'));
      }

      // Skills
      if (resumeData.skills?.length > 0) {
        addSection('Skills', resumeData.skills.join(', '));
      }

      // Projects
      if (resumeData.projects?.length > 0) {
        addSection('Projects', resumeData.projects.map((proj: any) => 
          `${proj.name}\n${proj.description}\nTechnologies: ${proj.technologies}`
        ).join('\n\n'));
      }

      // Certifications
      if (resumeData.certifications?.length > 0) {
        addSection('Certifications', resumeData.certifications.map((cert: any) => 
          `${cert.name} - ${cert.issuer} (${cert.date})`
        ).join('\n'));
      }

      // Languages
      if (resumeData.languages?.length > 0) {
        addSection('Languages', resumeData.languages.map((lang: any) => 
          `${lang.language} - ${lang.proficiency}`
        ).join(', '));
      }

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename);
  }
}

export default PDFGenerator;
