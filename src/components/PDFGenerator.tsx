
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Clean text helper
      const cleanText = (text: string): string => {
        return text?.replace(/[^\x20-\x7E]/g, '').trim() || '';
      };

      // Professional header with better spacing
      if (resumeData.personal?.fullName) {
        // Name
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 81, 140);
        pdf.text(cleanText(resumeData.personal.fullName), margin, yPosition);
        yPosition += 12;

        // Contact info in one line
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
        if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
        if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));
        
        if (contactInfo.length > 0) {
          pdf.text(contactInfo.join(' | '), margin, yPosition);
          yPosition += 8;
        }

        // Line separator
        pdf.setDrawColor(31, 81, 140);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 15;
      }

      // Page break helper
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Section header helper
      const addSectionHeader = (title: string) => {
        checkPageBreak(20);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 81, 140);
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 8;
        
        // Underline
        pdf.setDrawColor(31, 81, 140);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      };

      // Text helper with better wrapping
      const addText = (text: string, fontSize = 10, fontStyle = 'normal', indent = 0) => {
        if (!text) return;
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(0, 0, 0);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText(text), maxWidth);
        
        for (const line of lines) {
          checkPageBreak(fontSize * 0.6);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.6;
        }
        yPosition += 3;
      };

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary');
        addText(resumeData.personal.summary, 10, 'normal');
        yPosition += 5;
      }

      // Experience
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          checkPageBreak(30);
          
          // Job title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(cleanText(exp.position || 'Position'), margin, yPosition);
          yPosition += 6;
          
          // Company and dates
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          
          const companyInfo = cleanText(exp.company || 'Company');
          let dateInfo = '';
          
          if (exp.startDate || exp.endDate) {
            const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
            const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
            dateInfo = ` | ${startDate} - ${endDate}`;
          }
          
          pdf.text(companyInfo + dateInfo, margin, yPosition);
          yPosition += 5;
          
          if (exp.location) {
            pdf.text(cleanText(exp.location), margin, yPosition);
            yPosition += 5;
          }
          
          // Description with proper bullet points
          if (exp.description) {
            const bullets = cleanText(exp.description)
              .split(/[.\n•]/)
              .map(item => item.trim())
              .filter(item => item && item.length > 10);
            
            for (const bullet of bullets) {
              checkPageBreak(12);
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(0, 0, 0);
              
              // Bullet point
              pdf.text('•', margin + 5, yPosition);
              
              // Wrapped text
              const maxWidth = pageWidth - 2 * margin - 15;
              const wrappedLines = pdf.splitTextToSize(bullet, maxWidth);
              
              for (let i = 0; i < wrappedLines.length; i++) {
                if (i > 0) checkPageBreak(10);
                pdf.text(wrappedLines[i], margin + 15, yPosition);
                if (i < wrappedLines.length - 1) yPosition += 5;
              }
              yPosition += 8;
            }
          }
          yPosition += 8;
        }
      }

      // Education
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          checkPageBreak(20);
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(cleanText(edu.degree || 'Degree'), margin, yPosition);
          yPosition += 6;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          
          const schoolInfo = cleanText(edu.school || 'School');
          const eduDate = edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : '';
          pdf.text(schoolInfo + eduDate, margin, yPosition);
          yPosition += 5;
          
          if (edu.location) {
            pdf.text(cleanText(edu.location), margin, yPosition);
            yPosition += 5;
          }
          
          if (edu.gpa) {
            pdf.text(`GPA: ${cleanText(edu.gpa)}`, margin, yPosition);
            yPosition += 5;
          }
          yPosition += 8;
        }
      }

      // Skills with professional formatting
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        const skillsText = resumeData.skills
          .filter((skill: string) => skill && skill.trim())
          .map((skill: string) => cleanText(skill))
          .join(' • ');
        
        const maxWidth = pageWidth - 2 * margin;
        const lines = pdf.splitTextToSize(skillsText, maxWidth);
        
        for (const line of lines) {
          checkPageBreak(12);
          pdf.text(line, margin, yPosition);
          yPosition += 6;
        }
        yPosition += 8;
      }

      // Projects
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Projects');
        
        for (const project of resumeData.projects) {
          checkPageBreak(25);
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(cleanText(project.name || 'Project'), margin, yPosition);
          yPosition += 6;
          
          if (project.technologies) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(51, 65, 85);
            pdf.text(`Technologies: ${cleanText(project.technologies)}`, margin, yPosition);
            yPosition += 5;
          }
          
          if (project.description) {
            addText(project.description, 9, 'normal', 0);
          }
          
          if (project.link) {
            pdf.setFontSize(9);
            pdf.setTextColor(31, 81, 140);
            pdf.text(cleanText(project.link), margin, yPosition);
            yPosition += 8;
          }
        }
      }

      // Additional sections in columns
      const hasAdditionalSections = (resumeData.certifications?.length > 0) || 
                                   (resumeData.languages?.length > 0) || 
                                   (resumeData.interests?.length > 0);

      if (hasAdditionalSections) {
        checkPageBreak(40);
        
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        const columnWidth = (pageWidth - 3 * margin) / 2;

        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 81, 140);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 8;
          
          for (const cert of resumeData.certifications) {
            if (leftColumnY > pageHeight - 30) break;
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            
            const certText = `• ${cleanText(cert.name)} - ${cleanText(cert.issuer)} (${cleanText(cert.date)})`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            
            for (const line of lines) {
              pdf.text(line, margin, leftColumnY);
              leftColumnY += 5;
            }
          }
        }

        // Right column - Languages
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 81, 140);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 8;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY > pageHeight - 30) break;
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            pdf.text(`• ${cleanText(lang.language)} (${cleanText(lang.proficiency)})`, rightColumnX, rightColumnY);
            rightColumnY += 5;
          }
        }

        yPosition = Math.max(leftColumnY, rightColumnY) + 10;

        // Interests
        if (resumeData.interests?.length > 0) {
          checkPageBreak(15);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 81, 140);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 8;
          
          const interestsText = resumeData.interests
            .filter((interest: string) => interest && interest.trim())
            .map((interest: string) => cleanText(interest))
            .join(' • ');
          
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          addText(interestsText, 9, 'normal');
        }
      }

      // Save the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename, jobDescription);
  }
}

export default PDFGenerator;
