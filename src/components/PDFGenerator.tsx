
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      let yPosition = margin;

      // Template-specific configurations
      const templateConfigs = {
        0: { // Modern Professional
          primaryColor: [31, 81, 140],
          secondaryColor: [51, 65, 85],
          headerStyle: 'modern',
          fontStyle: 'professional'
        },
        1: { // Executive Leadership
          primaryColor: [55, 65, 81],
          secondaryColor: [75, 85, 99],
          headerStyle: 'executive',
          fontStyle: 'bold'
        },
        2: { // Classic Corporate
          primaryColor: [71, 85, 105],
          secondaryColor: [100, 116, 139],
          headerStyle: 'classic',
          fontStyle: 'traditional'
        },
        3: { // Creative Designer
          primaryColor: [147, 51, 234],
          secondaryColor: [236, 72, 153],
          headerStyle: 'creative',
          fontStyle: 'modern'
        },
        4: { // Tech Specialist
          primaryColor: [5, 150, 105],
          secondaryColor: [6, 182, 212],
          headerStyle: 'tech',
          fontStyle: 'clean'
        }
        // Add more template configs as needed
      };

      const config = templateConfigs[templateId] || templateConfigs[0];

      // Clean text helper
      const cleanText = (text: string): string => {
        return text?.replace(/[^\x20-\x7E]/g, '').trim() || '';
      };

      // Template-specific header rendering
      const renderHeader = () => {
        if (!resumeData.personal?.fullName) return;

        switch (config.headerStyle) {
          case 'executive':
            // Executive style header
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            const nameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - nameWidth) / 2, yPosition);
            yPosition += 10;
            break;
            
          case 'creative':
            // Creative style header with background
            pdf.setFillColor(...config.primaryColor);
            pdf.rect(0, 0, pageWidth, 25, 'F');
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            const creativeNameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - creativeNameWidth) / 2, 15);
            yPosition = 30;
            break;
            
          case 'tech':
            // Tech style header with accent
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            pdf.text(cleanText(resumeData.personal.fullName), margin, yPosition);
            yPosition += 8;
            // Tech accent line
            pdf.setDrawColor(...config.secondaryColor);
            pdf.setLineWidth(2);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 8;
            break;
            
          default: // Modern Professional and others
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            const modernNameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - modernNameWidth) / 2, yPosition);
            yPosition += 8;
        }

        // Contact info (same for all templates but with template colors)
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...config.secondaryColor);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
        if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
        if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));
        
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' | ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 6;
        }

        // Separator line
        if (config.headerStyle !== 'creative') {
          pdf.setDrawColor(...config.primaryColor);
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        } else {
          yPosition += 6;
        }
      };

      // Page break helper
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Template-specific section header
      const addSectionHeader = (title: string) => {
        checkPageBreak(15);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...config.primaryColor);
        
        // Center the section headers
        const headerWidth = pdf.getTextWidth(title.toUpperCase());
        pdf.text(title.toUpperCase(), (pageWidth - headerWidth) / 2, yPosition);
        yPosition += 6;
        
        // Template-specific underline
        if (config.headerStyle === 'creative') {
          pdf.setDrawColor(...config.secondaryColor);
          pdf.setLineWidth(1);
          const lineStart = (pageWidth - headerWidth) / 2;
          pdf.line(lineStart, yPosition, lineStart + headerWidth, yPosition);
        } else {
          pdf.setDrawColor(...config.primaryColor);
          pdf.setLineWidth(0.3);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        }
        yPosition += 8;
      };

      // Text helper with template styling
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

      // Bullet points with template-specific styling
      const addBulletPoints = (text: string, indent = 10) => {
        if (!text) return;
        
        const bullets = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        for (const bullet of bullets) {
          checkPageBreak(10);
          
          let bulletText = bullet;
          const bulletSymbol = config.headerStyle === 'creative' ? '▸' : '•';
          if (!bulletText.match(/^[•·‣▪▫▸-]\s/)) {
            bulletText = `${bulletSymbol} ${bulletText.replace(/^[•·‣▪▫▸-]*\s*/, '')}`;
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

      // Render header with template styling
      renderHeader();

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary');
        addText(resumeData.personal.summary, 9, 'normal');
        yPosition += 4;
      }

      // Experience with template-specific styling
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          checkPageBreak(25);
          
          // Job title with template styling
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text(cleanText(exp.position || 'Position'), margin, yPosition);
          yPosition += 5;
          
          // Company and dates
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...config.secondaryColor);
          
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
          
          // Description with template-specific bullets
          if (exp.description) {
            yPosition += 2;
            addBulletPoints(exp.description, 5);
          }
          yPosition += 6;
        }
      }

      // Education with full details
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          checkPageBreak(20);
          
          // Degree with template styling
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text(cleanText(edu.degree || 'Degree'), margin, yPosition);
          yPosition += 5;
          
          // School and date
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...config.secondaryColor);
          
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
          
          // Description
          if (edu.description) {
            yPosition += 2;
            addText(edu.description, 8, 'normal', 5);
          }
          
          // Relevant Courses
          if (edu.courses) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(...config.secondaryColor);
            pdf.text('Relevant Coursework:', margin, yPosition);
            yPosition += 4;
            addText(edu.courses, 8, 'normal', 5);
          }
          
          // Honors/Awards
          if (edu.honors) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(...config.secondaryColor);
            pdf.text('Honors & Awards:', margin, yPosition);
            yPosition += 4;
            addText(edu.honors, 8, 'normal', 5);
          }
          
          yPosition += 6;
        }
      }

      // Skills with template styling
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

      // Projects with template styling
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Projects');
        
        for (const project of resumeData.projects) {
          checkPageBreak(25);
          
          // Project name with template styling
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text(cleanText(project.name || 'Project'), margin, yPosition);
          yPosition += 5;
          
          // Date range
          if (project.startDate || project.endDate) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...config.secondaryColor);
            const startDate = project.startDate || '';
            const endDate = project.endDate || 'Present';
            pdf.text(`${startDate} - ${endDate}`, margin, yPosition);
            yPosition += 4;
          }
          
          // Technologies
          if (project.technologies) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(...config.secondaryColor);
            pdf.text(`Technologies: ${cleanText(project.technologies)}`, margin, yPosition);
            yPosition += 4;
          }
          
          // Full project description with template-specific bullets
          if (project.description) {
            yPosition += 1;
            addBulletPoints(project.description, 5);
          }
          
          // Project link
          if (project.link) {
            pdf.setFontSize(8);
            pdf.setTextColor(...config.primaryColor);
            pdf.text(cleanText(project.link), margin, yPosition);
            yPosition += 6;
          } else {
            yPosition += 4;
          }
        }
      }

      // Additional sections with template styling
      const hasAdditionalSections = (resumeData.certifications?.length > 0) || 
                                   (resumeData.languages?.length > 0) || 
                                   (resumeData.interests?.length > 0);

      if (hasAdditionalSections) {
        checkPageBreak(30);
        
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        const columnWidth = (pageWidth - 3 * margin) / 2;

        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          const certHeaderWidth = pdf.getTextWidth('CERTIFICATIONS');
          pdf.text('CERTIFICATIONS', (columnWidth - certHeaderWidth) / 2 + margin, leftColumnY);
          leftColumnY += 6;
          
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

        // Right column - Languages
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          const langHeaderWidth = pdf.getTextWidth('LANGUAGES');
          pdf.text('LANGUAGES', rightColumnX + (columnWidth - langHeaderWidth) / 2, rightColumnY);
          rightColumnY += 6;
          
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

        // Interests
        if (resumeData.interests?.length > 0) {
          checkPageBreak(12);
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          const interestHeaderWidth = pdf.getTextWidth('INTERESTS');
          pdf.text('INTERESTS', (pageWidth - interestHeaderWidth) / 2, yPosition);
          yPosition += 6;
          
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
