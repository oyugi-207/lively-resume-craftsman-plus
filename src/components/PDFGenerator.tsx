
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add hidden ATS keywords at the beginning (invisible to readers)
      if (resumeData.jobDescription) {
        pdf.setTextColor(255, 255, 255); // White text (invisible)
        pdf.setFontSize(1);
        const keywords = pdf.splitTextToSize(resumeData.jobDescription, pageWidth - 2 * margin);
        keywords.forEach((line: string) => {
          pdf.text(line, margin, yPosition);
          yPosition += 0.5;
        });
        yPosition = margin; // Reset position
        pdf.setTextColor(0, 0, 0); // Back to black text
      }

      // Helper function to add selectable text
      const addText = (text: string, fontSize: number = 12, fontStyle: string = 'normal', maxWidth: number = pageWidth - 2 * margin, color: string = 'black') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        
        // Set color
        if (color === 'blue') {
          pdf.setTextColor(37, 99, 235);
        } else if (color === 'gray') {
          pdf.setTextColor(107, 114, 128);
        } else {
          pdf.setTextColor(0, 0, 0);
        }
        
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
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Section title with better formatting
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(37, 99, 235); // Blue color
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 8;
        
        // Professional line under title
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
        
        // Reset color for content
        pdf.setTextColor(0, 0, 0);
        
        // Section content with better formatting
        if (typeof content === 'string') {
          addText(content, 11, 'normal');
        } else if (Array.isArray(content)) {
          content.forEach(item => {
            if (typeof item === 'string') {
              addText(`• ${item}`, 11, 'normal');
            } else {
              // Handle objects like experience, education with better layout
              if (item.position && item.company) {
                // Job title
                addText(item.position, 13, 'bold');
                // Company and dates
                const companyInfo = `${item.company}${item.location ? ` • ${item.location}` : ''}`;
                const dateInfo = `${item.startDate} - ${item.endDate}`;
                
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(37, 99, 235);
                
                // Company on left, dates on right
                pdf.text(companyInfo, margin, yPosition);
                const dateWidth = pdf.getTextWidth(dateInfo);
                pdf.text(dateInfo, pageWidth - margin - dateWidth, yPosition);
                yPosition += 8;
                
                // Description
                pdf.setTextColor(0, 0, 0);
                if (item.description) {
                  addText(item.description, 10, 'normal');
                }
                yPosition += 5;
              } else if (item.degree && item.school) {
                // Education formatting
                addText(item.degree, 12, 'bold');
                addText(`${item.school}${item.location ? `, ${item.location}` : ''}`, 11, 'normal', pageWidth - 2 * margin, 'blue');
                if (item.startDate && item.endDate) {
                  addText(`${item.startDate} - ${item.endDate}`, 10, 'normal', pageWidth - 2 * margin, 'gray');
                }
                if (item.gpa) {
                  addText(`GPA: ${item.gpa}`, 10, 'normal', pageWidth - 2 * margin, 'gray');
                }
                yPosition += 3;
              } else {
                // Generic object handling
                Object.keys(item).forEach(key => {
                  if (key !== 'id' && item[key]) {
                    addText(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${item[key]}`, 11, 'normal');
                  }
                });
                yPosition += 5;
              }
            }
          });
        }
        yPosition += 8;
      };

      // Professional Header with better layout
      if (resumeData.personal?.fullName) {
        // Name - centered and large
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(37, 99, 235);
        const nameWidth = pdf.getTextWidth(resumeData.personal.fullName);
        pdf.text(resumeData.personal.fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 15;

        // Contact info - professional layout
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(107, 114, 128);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(resumeData.personal.email);
        if (resumeData.personal.phone) contactInfo.push(resumeData.personal.phone);
        if (resumeData.personal.location) contactInfo.push(resumeData.personal.location);
        
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' • ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 8;
        }

        // Professional line separator
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSection('Professional Summary', resumeData.personal.summary);
      }

      // Experience with improved formatting
      if (resumeData.experience?.length > 0) {
        addSection('Professional Experience', resumeData.experience);
      }

      // Education
      if (resumeData.education?.length > 0) {
        addSection('Education', resumeData.education);
      }

      // Skills with better presentation
      if (resumeData.skills?.length > 0) {
        addSection('Technical Skills', resumeData.skills.join(' • '));
      }

      // Projects
      if (resumeData.projects?.length > 0) {
        const projectsFormatted = resumeData.projects.map((proj: any) => ({
          name: proj.name,
          description: proj.description,
          technologies: proj.technologies ? `Technologies: ${proj.technologies}` : '',
          duration: proj.startDate && proj.endDate ? `${proj.startDate} - ${proj.endDate}` : ''
        }));
        addSection('Projects', projectsFormatted);
      }

      // Certifications
      if (resumeData.certifications?.length > 0) {
        const certsFormatted = resumeData.certifications.map((cert: any) => 
          `${cert.name} - ${cert.issuer} (${cert.date})`
        );
        addSection('Certifications', certsFormatted);
      }

      // Languages
      if (resumeData.languages?.length > 0) {
        const langsFormatted = resumeData.languages.map((lang: any) => 
          `${lang.language} (${lang.proficiency})`
        );
        addSection('Languages', langsFormatted.join(' • '));
      }

      // Save the PDF with proper metadata for ATS systems
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Resume'}`,
        subject: 'Professional Resume',
        author: resumeData.personal?.fullName || 'Job Candidate',
        keywords: resumeData.skills?.join(', ') || '',
        creator: 'Resume Builder Pro'
      });

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
