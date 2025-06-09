
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add hidden ATS keywords at the beginning (invisible to readers but detectable by ATS)
      if (resumeData.jobDescription) {
        pdf.setTextColor(255, 255, 255); // White text (invisible)
        pdf.setFontSize(0.1); // Extremely small
        const keywords = pdf.splitTextToSize(resumeData.jobDescription, pageWidth - 2 * margin);
        keywords.forEach((line: string) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 0.1;
        });
        yPosition = margin; // Reset position for visible content
        pdf.setTextColor(0, 0, 0); // Back to black text
      }

      // Helper function to check if new page is needed
      const checkNewPage = (requiredSpace: number = 20) => {
        if (yPosition > pageHeight - margin - requiredSpace) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to add selectable text with proper formatting
      const addText = (text: string, fontSize: number = 11, fontStyle: string = 'normal', color: string = 'black', indent: number = 0) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        
        // Set color
        switch(color) {
          case 'blue':
            pdf.setTextColor(37, 99, 235);
            break;
          case 'gray':
            pdf.setTextColor(107, 114, 128);
            break;
          case 'green':
            pdf.setTextColor(34, 197, 94);
            break;
          case 'orange':
            pdf.setTextColor(249, 115, 22);
            break;
          default:
            pdf.setTextColor(0, 0, 0);
        }
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          checkNewPage();
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 2;
      };

      // Helper function to add section headers
      const addSectionHeader = (title: string, color: string = 'blue') => {
        checkNewPage(15);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        
        switch(color) {
          case 'blue':
            pdf.setTextColor(37, 99, 235);
            break;
          case 'green':
            pdf.setTextColor(34, 197, 94);
            break;
          case 'orange':
            pdf.setTextColor(249, 115, 22);
            break;
          default:
            pdf.setTextColor(0, 0, 0);
        }
        
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 6;
        
        // Add underline
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        
        pdf.setTextColor(0, 0, 0); // Reset to black
      };

      // Template-specific formatting based on templateId
      const getTemplateColors = (templateId: number) => {
        const colorSchemes = {
          0: { primary: 'blue', secondary: 'gray' },      // Modern Professional
          1: { primary: 'orange', secondary: 'gray' },    // Executive
          2: { primary: 'blue', secondary: 'gray' },      // Creative
          3: { primary: 'green', secondary: 'gray' },     // Tech
          4: { primary: 'blue', secondary: 'gray' },      // Minimalist
          6: { primary: 'blue', secondary: 'gray' },      // Professional Blue
          7: { primary: 'orange', secondary: 'gray' },    // Legal
          8: { primary: 'blue', secondary: 'gray' },      // Engineering
          9: { primary: 'blue', secondary: 'gray' },      // Data Specialist
          10: { primary: 'green', secondary: 'gray' },    // Supply Chain
          11: { primary: 'blue', secondary: 'gray' },     // Clean Modern
        };
        return colorSchemes[templateId] || colorSchemes[0];
      };

      const colors = getTemplateColors(templateId);

      // Professional Header
      if (resumeData.personal?.fullName) {
        // Name - centered and large
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(37, 99, 235);
        const nameWidth = pdf.getTextWidth(resumeData.personal.fullName);
        pdf.text(resumeData.personal.fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 12;

        // Professional title if available
        if (resumeData.personal.summary) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(107, 114, 128);
          const titleText = resumeData.personal.summary.substring(0, 80) + (resumeData.personal.summary.length > 80 ? '...' : '');
          const titleWidth = pdf.getTextWidth(titleText);
          pdf.text(titleText, (pageWidth - titleWidth) / 2, yPosition);
          yPosition += 8;
        }

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
          yPosition += 10;
        }

        // Professional separator line
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary', colors.primary);
        addText(resumeData.personal.summary, 11, 'normal', 'black');
        yPosition += 5;
      }

      // Experience with improved formatting
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience', colors.primary);
        
        resumeData.experience.forEach((exp: any, index: number) => {
          checkNewPage(25);
          
          // Job title
          pdf.setFontSize(13);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(exp.position || 'Position', margin, yPosition);
          yPosition += 6;
          
          // Company and dates - side by side
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(37, 99, 235);
          
          const companyInfo = `${exp.company || 'Company'}${exp.location ? ` • ${exp.location}` : ''}`;
          const dateInfo = `${exp.startDate || ''} - ${exp.endDate || ''}`;
          
          pdf.text(companyInfo, margin, yPosition);
          if (dateInfo.trim() !== ' - ') {
            const dateWidth = pdf.getTextWidth(dateInfo);
            pdf.text(dateInfo, pageWidth - margin - dateWidth, yPosition);
          }
          yPosition += 8;
          
          // Description
          if (exp.description) {
            pdf.setTextColor(0, 0, 0);
            const descriptions = exp.description.split('.').filter((desc: string) => desc.trim().length > 0);
            descriptions.forEach((desc: string) => {
              if (desc.trim()) {
                addText(`• ${desc.trim()}`, 10, 'normal', 'black', 5);
              }
            });
          }
          yPosition += 8;
        });
      }

      // Education
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education', colors.primary);
        
        resumeData.education.forEach((edu: any) => {
          checkNewPage(15);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(edu.degree || 'Degree', margin, yPosition);
          yPosition += 5;
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(37, 99, 235);
          
          const schoolInfo = `${edu.school || 'School'}${edu.location ? `, ${edu.location}` : ''}`;
          const eduDate = `${edu.startDate || ''} - ${edu.endDate || ''}`;
          
          pdf.text(schoolInfo, margin, yPosition);
          if (eduDate.trim() !== ' - ') {
            const dateWidth = pdf.getTextWidth(eduDate);
            pdf.text(eduDate, pageWidth - margin - dateWidth, yPosition);
          }
          yPosition += 5;
          
          if (edu.gpa) {
            pdf.setTextColor(107, 114, 128);
            pdf.text(`GPA: ${edu.gpa}`, margin, yPosition);
            yPosition += 5;
          }
          yPosition += 5;
        });
      }

      // Skills with better presentation
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies', colors.primary);
        
        // Group skills into lines
        const skillsPerLine = 4;
        const skillGroups = [];
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          skillGroups.push(resumeData.skills.slice(i, i + skillsPerLine));
        }
        
        skillGroups.forEach((group: string[]) => {
          addText(group.join(' • '), 11, 'normal', 'black');
        });
        yPosition += 5;
      }

      // Projects
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Key Projects', colors.primary);
        
        resumeData.projects.forEach((proj: any) => {
          checkNewPage(20);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(proj.name || 'Project', margin, yPosition);
          yPosition += 5;
          
          if (proj.description) {
            addText(proj.description, 10, 'normal', 'black', 5);
          }
          
          if (proj.technologies) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(107, 114, 128);
            addText(`Technologies: ${proj.technologies}`, 10, 'italic', 'gray', 5);
          }
          yPosition += 5;
        });
      }

      // Certifications
      if (resumeData.certifications?.length > 0) {
        addSectionHeader('Professional Certifications', colors.primary);
        
        resumeData.certifications.forEach((cert: any) => {
          const certText = `${cert.name || 'Certification'} - ${cert.issuer || 'Issuer'} (${cert.date || 'Date'})`;
          addText(`• ${certText}`, 11, 'normal', 'black');
        });
        yPosition += 5;
      }

      // Languages
      if (resumeData.languages?.length > 0) {
        addSectionHeader('Languages', colors.primary);
        
        const langText = resumeData.languages.map((lang: any) => 
          `${lang.language || 'Language'} (${lang.proficiency || 'Level'})`
        ).join(' • ');
        addText(langText, 11, 'normal', 'black');
      }

      // Set PDF metadata for better ATS compatibility
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Professional Resume'}`,
        subject: 'Professional Resume - ATS Optimized',
        author: resumeData.personal?.fullName || 'Job Candidate',
        keywords: `${resumeData.skills?.join(', ') || ''}, ${resumeData.jobDescription ? 'ATS Keywords' : ''}`,
        creator: 'Resume Builder Pro - Text-Based PDF Generator'
      });

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
