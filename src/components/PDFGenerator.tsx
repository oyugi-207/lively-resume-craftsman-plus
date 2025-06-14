import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      let yPosition = margin;

      // Clean text helper
      const cleanText = (text: string): string => {
        return text?.replace(/[^\x20-\x7E]/g, '').trim() || '';
      };

      // Professional header with compact spacing
      if (resumeData.personal?.fullName) {
        // Name
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 81, 140);
        pdf.text(cleanText(resumeData.personal.fullName), margin, yPosition);
        yPosition += 8;

        // Contact info in one line
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
        if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
        if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));
        
        if (contactInfo.length > 0) {
          pdf.text(contactInfo.join(' | '), margin, yPosition);
          yPosition += 6;
        }

        // Line separator
        pdf.setDrawColor(31, 81, 140);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }

      // Page break helper
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Section header helper - NOW CENTERED
      const addSectionHeader = (title: string) => {
        checkPageBreak(15);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 81, 140);
        
        // Center the text
        const textWidth = pdf.getStringUnitWidth(title.toUpperCase()) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        pdf.text(title.toUpperCase(), textX, yPosition);
        yPosition += 6;
        
        // Underline - also centered
        const underlineWidth = textWidth + 10; // slightly wider than text
        const underlineX = (pageWidth - underlineWidth) / 2;
        pdf.setDrawColor(31, 81, 140);
        pdf.setLineWidth(0.3);
        pdf.line(underlineX, yPosition, underlineX + underlineWidth, yPosition);
        yPosition += 8;
      };

      // Text helper with better wrapping and compact spacing
      const addText = (text: string, fontSize = 9, fontStyle = 'normal', indent = 0) => {
        if (!text) return;
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(0, 0, 0);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText(text), maxWidth);
        
        for (const line of lines) {
          checkPageBreak(fontSize * 0.5);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.5;
        }
        yPosition += 2;
      };

      // Improved bullet point helper with proper bullet symbols
      const addBulletPoints = (text: string, indent = 10) => {
        if (!text) return;
        
        const bullets = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        for (const bullet of bullets) {
          checkPageBreak(10);
          
          let bulletText = bullet;
          if (!bulletText.match(/^[•·‣▪▫-]\s/)) {
            bulletText = `• ${bulletText.replace(/^[•·‣▪▫-]*\s*/, '')}`;
          }
          
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          
          const maxWidth = pageWidth - 2 * margin - indent;
          const wrappedLines = pdf.splitTextToSize(cleanText(bulletText), maxWidth);
          
          for (let i = 0; i < wrappedLines.length; i++) {
            if (i > 0) checkPageBreak(8);
            pdf.text(wrappedLines[i], margin + indent, yPosition);
            yPosition += 4.5;
          }
          yPosition += 3;
        }
      };

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary');
        addText(resumeData.personal.summary, 9, 'normal');
        yPosition += 4;
      }

      // Experience with proper bullet formatting
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          checkPageBreak(25);
          
          // Job title
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(cleanText(exp.position || 'Position'), margin, yPosition);
          yPosition += 5;
          
          // Company and dates
          pdf.setFontSize(9);
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
          yPosition += 4;
          
          if (exp.location) {
            pdf.text(cleanText(exp.location), margin, yPosition);
            yPosition += 4;
          }
          
          // Description with vertical bullet points
          if (exp.description) {
            yPosition += 2;
            addBulletPoints(exp.description, 5);
          }
          yPosition += 6;
        }
      }

      // Enhanced Education Section with all details
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          checkPageBreak(20);
          
          // Degree
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(cleanText(edu.degree || 'Degree'), margin, yPosition);
          yPosition += 5;
          
          // School and date
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(51, 65, 85);
          
          const schoolInfo = cleanText(edu.school || 'School');
          const eduDate = edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : '';
          pdf.text(schoolInfo + eduDate, margin, yPosition);
          yPosition += 4;
          
          // Location
          if (edu.location) {
            pdf.text(cleanText(edu.location), margin, yPosition);
            yPosition += 4;
          }
          
          // GPA
          if (edu.gpa) {
            pdf.text(`GPA: ${cleanText(edu.gpa)}`, margin, yPosition);
            yPosition += 4;
          }
          
          // Description (NEW)
          if (edu.description) {
            yPosition += 2;
            addText(edu.description, 8, 'normal', 5);
          }
          
          // Relevant Courses (NEW)
          if (edu.courses) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(51, 65, 85);
            pdf.text('Relevant Coursework:', margin, yPosition);
            yPosition += 4;
            addText(edu.courses, 8, 'normal', 5);
          }
          
          // Honors/Awards (NEW)
          if (edu.honors) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(51, 65, 85);
            pdf.text('Honors & Awards:', margin, yPosition);
            yPosition += 4;
            addText(edu.honors, 8, 'normal', 5);
          }
          
          yPosition += 6;
        }
      }

      // Skills with compact formatting
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies');
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        const skillsText = resumeData.skills
          .filter((skill: string) => skill && skill.trim())
          .map((skill: string) => cleanText(skill))
          .join(' • ');
        
        const maxWidth = pageWidth - 2 * margin;
        const lines = pdf.splitTextToSize(skillsText, maxWidth);
        
        for (const line of lines) {
          checkPageBreak(8);
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 6;
      }

      // Enhanced Projects with full description
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Projects');
        
        for (const project of resumeData.projects) {
          checkPageBreak(25);
          
          // Project name
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(cleanText(project.name || 'Project'), margin, yPosition);
          yPosition += 5;
          
          // Date range
          if (project.startDate || project.endDate) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(51, 65, 85);
            const startDate = project.startDate || '';
            const endDate = project.endDate || 'Present';
            pdf.text(`${startDate} - ${endDate}`, margin, yPosition);
            yPosition += 4;
          }
          
          // Technologies
          if (project.technologies) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(51, 65, 85);
            pdf.text(`Technologies: ${cleanText(project.technologies)}`, margin, yPosition);
            yPosition += 4;
          }
          
          // Full project description with bullet points
          if (project.description) {
            yPosition += 1;
            addBulletPoints(project.description, 5);
          }
          
          // Project link
          if (project.link) {
            pdf.setFontSize(8);
            pdf.setTextColor(31, 81, 140);
            pdf.text(cleanText(project.link), margin, yPosition);
            yPosition += 6;
          } else {
            yPosition += 4;
          }
        }
      }

      // Additional sections with centered headers
      const hasAdditionalSections = (resumeData.certifications?.length > 0) || 
                                   (resumeData.languages?.length > 0) || 
                                   (resumeData.interests?.length > 0);

      if (hasAdditionalSections) {
        checkPageBreak(30);
        
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        const columnWidth = (pageWidth - 3 * margin) / 2;

        // Left column - Certifications with centered header
        if (resumeData.certifications?.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 81, 140);
          
          // Center the certifications header within the left column
          const certHeaderWidth = pdf.getStringUnitWidth('CERTIFICATIONS') * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const certHeaderX = margin + (columnWidth - certHeaderWidth) / 2;
          pdf.text('CERTIFICATIONS', certHeaderX, leftColumnY);
          leftColumnY += 6;
          
          // Certifications content
          for (const cert of resumeData.certifications) {
            if (leftColumnY > pageHeight - 25) break;
            
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            
            const certText = `• ${cleanText(cert.name)} - ${cleanText(cert.issuer)} (${cleanText(cert.date)})`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            
            for (const line of lines) {
              pdf.text(line, margin, leftColumnY);
              leftColumnY += 4;
            }
          }
        }

        // Right column - Languages with centered header
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 81, 140);
          
          // Center the languages header within the right column
          const langHeaderWidth = pdf.getStringUnitWidth('LANGUAGES') * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const langHeaderX = rightColumnX + (columnWidth - langHeaderWidth) / 2;
          pdf.text('LANGUAGES', langHeaderX, rightColumnY);
          rightColumnY += 6;
          
          // Languages content
          for (const lang of resumeData.languages) {
            if (rightColumnY > pageHeight - 25) break;
            
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            pdf.text(`• ${cleanText(lang.language)} (${cleanText(lang.proficiency)})`, rightColumnX, rightColumnY);
            rightColumnY += 4;
          }
        }

        yPosition = Math.max(leftColumnY, rightColumnY) + 8;

        // Interests with centered header
        if (resumeData.interests?.length > 0) {
          checkPageBreak(12);
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(31, 81, 140);
          
          // Center the interests header
          const interestsHeaderWidth = pdf.getStringUnitWidth('INTERESTS') * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
          const interestsHeaderX = (pageWidth - interestsHeaderWidth) / 2;
          pdf.text('INTERESTS', interestsHeaderX, yPosition);
          yPosition += 6;
          
          // Interests content
          const interestsText = resumeData.interests
            .filter((interest: string) => interest && interest.trim())
            .map((interest: string) => cleanText(interest))
            .join(' • ');
          
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          addText(interestsText, 8, 'normal');
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
