
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Remove all hidden text and ATS keyword injection
      // Focus on clean, visible content only

      // Helper functions for consistent styling
      const addText = (text: string, fontSize: number = 10, fontStyle: string = 'normal', color: [number, number, number] = [0, 0, 0], indent: number = 0, maxWidth?: number) => {
        if (yPosition > pageHeight - 20) return false; // Prevent overflow
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(color[0], color[1], color[2]);
        
        const textWidth = maxWidth || (pageWidth - 2 * margin - indent);
        const lines = pdf.splitTextToSize(text, textWidth);
        
        lines.forEach((line: string) => {
          if (yPosition < pageHeight - 15) {
            pdf.text(line, margin + indent, yPosition);
            yPosition += fontSize * 0.5;
          }
        });
        yPosition += 2;
        return true;
      };

      const addSectionHeader = (title: string, color: [number, number, number] = [37, 99, 235]) => {
        if (yPosition > pageHeight - 25) return false;
        
        // Section header
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(color[0], color[1], color[2]);
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 5;
        
        // Underline
        pdf.setDrawColor(color[0], color[1], color[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
        
        return true;
      };

      // Template-specific colors
      const getTemplateColors = (templateId: number) => {
        const schemes = {
          0: { primary: [37, 99, 235], secondary: [107, 114, 128] },    // Modern Professional - Blue
          1: { primary: [55, 65, 81], secondary: [107, 114, 128] },     // Executive - Gray
          2: { primary: [147, 51, 234], secondary: [236, 72, 153] },    // Creative - Purple/Pink
          3: { primary: [34, 197, 94], secondary: [107, 114, 128] },    // Tech - Green
          4: { primary: [37, 99, 235], secondary: [107, 114, 128] },    // Minimalist - Blue
          5: { primary: [55, 65, 81], secondary: [107, 114, 128] },     // Corporate Classic - Gray
          6: { primary: [37, 99, 235], secondary: [107, 114, 128] },    // Professional Blue
          7: { primary: [55, 65, 81], secondary: [107, 114, 128] },     // Legal - Gray
          8: { primary: [34, 197, 94], secondary: [107, 114, 128] },    // Engineering - Green
          9: { primary: [34, 197, 94], secondary: [107, 114, 128] },    // Data Specialist - Green
          10: { primary: [55, 65, 81], secondary: [107, 114, 128] },    // Supply Chain - Gray
          11: { primary: [37, 99, 235], secondary: [107, 114, 128] },   // Clean Modern - Blue
        };
        return schemes[templateId] || schemes[0];
      };

      const colors = getTemplateColors(templateId);

      // Header Section
      if (resumeData.personal?.fullName) {
        // Name - centered and prominent
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        const nameWidth = pdf.getTextWidth(resumeData.personal.fullName);
        pdf.text(resumeData.personal.fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 10;

        // Contact information - centered
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(resumeData.personal.email);
        if (resumeData.personal.phone) contactInfo.push(resumeData.personal.phone);
        if (resumeData.personal.location) contactInfo.push(resumeData.personal.location);
        
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' • ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 12;
        }

        // Separator line
        pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary', colors.primary);
        addText(resumeData.personal.summary, 10, 'normal', [0, 0, 0]);
        yPosition += 3;
      }

      // Professional Experience
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience', colors.primary);
        
        resumeData.experience.forEach((exp: any) => {
          if (yPosition > pageHeight - 30) return; // Skip if no space
          
          // Job title
          addText(exp.position || 'Position', 11, 'bold', [0, 0, 0]);
          
          // Company and dates
          const companyLine = `${exp.company || 'Company'} | ${exp.location || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`;
          addText(companyLine, 10, 'normal', colors.primary);
          
          // Description with bullet points
          if (exp.description) {
            const bullets = exp.description.split('\n').filter((line: string) => line.trim());
            bullets.slice(0, 4).forEach((bullet: string) => { // Limit bullets to save space
              const cleanBullet = bullet.startsWith('•') ? bullet : `• ${bullet}`;
              addText(cleanBullet, 9, 'normal', [0, 0, 0], 5);
            });
          }
          yPosition += 3;
        });
      }

      // Education
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education', colors.primary);
        
        resumeData.education.forEach((edu: any) => {
          if (yPosition > pageHeight - 20) return;
          
          addText(edu.degree || 'Degree', 10, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'} | ${edu.location || ''} | ${edu.endDate || ''}`;
          addText(schoolLine, 9, 'normal', colors.primary);
          
          if (edu.gpa) {
            addText(`GPA: ${edu.gpa}`, 9, 'normal', [0, 0, 0], 5);
          }
          yPosition += 2;
        });
      }

      // Skills
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies', colors.primary);
        
        // Group skills into lines
        const skillsPerLine = 6;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          addText(skillGroup.join(' • '), 9, 'normal', [0, 0, 0]);
        }
        yPosition += 3;
      }

      // Projects (if space allows)
      if (resumeData.projects?.length > 0 && yPosition < pageHeight - 40) {
        addSectionHeader('Key Projects', colors.primary);
        
        resumeData.projects.slice(0, 2).forEach((project: any) => {
          if (yPosition > pageHeight - 25) return;
          
          addText(project.name || 'Project', 10, 'bold', [0, 0, 0]);
          if (project.technologies) {
            addText(`Technologies: ${project.technologies}`, 9, 'italic', colors.secondary);
          }
          if (project.description) {
            addText(project.description.substring(0, 150) + '...', 9, 'normal', [0, 0, 0], 5);
          }
          yPosition += 2;
        });
      }

      // Remaining sections in compact format
      const remainingSpace = pageHeight - yPosition - 20;
      
      if (remainingSpace > 30) {
        // Two-column layout for remaining sections
        const columnWidth = (pageWidth - 3 * margin) / 2;
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        
        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 6;
          
          resumeData.certifications.slice(0, 3).forEach((cert: any) => {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cert.name} - ${cert.issuer}`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            lines.forEach((line: string) => {
              pdf.text(line, margin, leftColumnY);
              leftColumnY += 4;
            });
          });
        }

        // Right column - Languages
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 6;
          
          resumeData.languages.forEach((lang: any) => {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
            rightColumnY += 4;
          });
        }

        // Add interests at the bottom if space
        const maxColumnY = Math.max(leftColumnY, rightColumnY);
        if (resumeData.interests?.length > 0 && maxColumnY < pageHeight - 15) {
          yPosition = maxColumnY + 5;
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 4;
          
          const interestsText = resumeData.interests.slice(0, 8).join(' • ');
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          pdf.text(interestsText, margin, yPosition);
        }
      }

      // Clean PDF metadata (no hidden content)
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Resume'}`,
        subject: 'Professional Resume',
        author: resumeData.personal?.fullName || 'Candidate',
        creator: 'Resume Builder Pro'
      });

      // Save the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename);
  }
}

export default PDFGenerator;
