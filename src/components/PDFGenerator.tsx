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
        1: { // Executive Leadership (Template 1)
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
        },
      };

      const config = templateConfigs[templateId] || templateConfigs[0];

      // Helper to provide color arguments
      const primaryColor = (pdf, fn) => fn(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
      const secondaryColor = (pdf, fn) => fn(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);

      const cleanText = (text: string): string => {
        return text?.replace(/[^\x20-\x7E]/g, '').trim() || '';
      };

      // Template-specific header rendering
      const renderHeader = () => {
        if (!resumeData.personal?.fullName) return;

        switch (config.headerStyle) {
          case 'executive':
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
            const nameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - nameWidth) / 2, yPosition);
            yPosition += 10;
            break;
          case 'creative':
            pdf.setFillColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
            pdf.rect(0, 0, pageWidth, 25, 'F');
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            const creativeNameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - creativeNameWidth) / 2, 15);
            yPosition = 30;
            break;
          case 'tech':
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
            pdf.text(cleanText(resumeData.personal.fullName), margin, yPosition);
            yPosition += 8;
            pdf.setDrawColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            pdf.setLineWidth(2);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 8;
            break;
          default:
            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
            const modernNameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - modernNameWidth) / 2, yPosition);
            yPosition += 8;
        }

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
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

        // Separator line - skip for creative
        if (config.headerStyle !== 'creative') {
          pdf.setDrawColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        } else {
          yPosition += 6;
        }
      };

      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 15) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // -- ENHANCED: All section headers centered, prominent, colorized underline
      const addSectionHeader = (title: string) => {
        checkPageBreak(15);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);

        const upperTitle = title.toUpperCase();
        const headerWidth = pdf.getTextWidth(upperTitle);
        // Center ALL headers
        pdf.text(upperTitle, (pageWidth - headerWidth) / 2, yPosition);

        yPosition += 6;

        // UNDERLINE, styled by template
        if (config.headerStyle === 'creative') {
          pdf.setDrawColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
          pdf.setLineWidth(1.2);
          const lineStart = (pageWidth - headerWidth) / 2;
          pdf.line(lineStart, yPosition, lineStart + headerWidth, yPosition);
        } else {
          pdf.setDrawColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.setLineWidth(0.7);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        }
        yPosition += 8;
      };

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

      // HEADER
      renderHeader();

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary');
        addText(resumeData.personal.summary, 9, 'normal');
        yPosition += 4;
      }

      // PROFESSIONAL EXPERIENCE
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience');
        for (const exp of resumeData.experience) {
          checkPageBreak(25);
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.text(cleanText(exp.position || 'Position'), margin, yPosition);
          yPosition += 5;

          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
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

          if (exp.description) {
            yPosition += 2;
            addBulletPoints(exp.description, 5);
          }
          yPosition += 6;
        }
      }

      // EDUCATION ENHANCED
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education');
        for (const edu of resumeData.education) {
          checkPageBreak(30);
          // Degree
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.text(cleanText(edu.degree || 'Degree'), margin, yPosition);
          yPosition += 5;

          // School + End date
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
          let schoolLine = cleanText(edu.school || 'School');
          if (edu.endDate) schoolLine += ` | ${new Date(edu.endDate + '-01').getFullYear()}`;
          pdf.text(schoolLine, margin, yPosition);
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
            pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            pdf.text('Relevant Coursework:', margin, yPosition);
            yPosition += 4;
            addText(edu.courses, 8, 'normal', 5);
          }
          // Honors/Awards
          if (edu.honors) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            pdf.text('Honors & Awards:', margin, yPosition);
            yPosition += 4;
            addText(edu.honors, 8, 'normal', 5);
          }

          yPosition += 6;
        }
      }

      // -- NEW: CORE COMPETENCIES (Skills) visually distinct
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies');
        const skills = resumeData.skills.filter((skill: string) => skill && skill.trim()).map((skill: string) => cleanText(skill));
        // Arrange as a grid of "tags"
        const tagPaddingX = 2;
        const tagPaddingY = 1.2;
        const tagGap = 2;
        const fontSize = 8.5;
        let x = margin;
        yPosition += 2;
        for (let i = 0; i < skills.length; i++) {
          const skill = skills[i];
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', 'bold');
          pdf.setDrawColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.setFillColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.setTextColor(255,255,255);
          const skillW = pdf.getTextWidth(skill) + tagPaddingX * 2;
          if (x + skillW > pageWidth - margin) { // wrap line
            x = margin;
            yPosition += fontSize + tagPaddingY * 2 + tagGap;
            checkPageBreak(fontSize + tagPaddingY * 2 + tagGap);
          }
          pdf.roundedRect(x, yPosition, skillW, fontSize + tagPaddingY * 2, 2, 2, 'F');
          pdf.text(skill, x + tagPaddingX, yPosition + fontSize + tagPaddingY/2 - 2);
          x += skillW + tagGap;
        }
        yPosition += fontSize + tagPaddingY * 2 + 8;
      }

      // PROJECTS - Improved display
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Projects');
        for (const project of resumeData.projects) {
          checkPageBreak(25);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.text(cleanText(project.name || 'Project'), margin, yPosition);
          yPosition += 5;
          // Date range
          if (project.startDate || project.endDate) {
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            const startDate = project.startDate || '';
            const endDate = project.endDate || 'Present';
            pdf.text(`${startDate} - ${endDate}`, margin, yPosition);
            yPosition += 4;
          }
          // Technologies
          if (project.technologies) {
            pdf.setFontSize(8.5);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            pdf.text('Technologies:', margin, yPosition);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0,0,0);
            pdf.text(cleanText(project.technologies), margin + 22, yPosition);
            yPosition += 4;
          }
          // Description bullets
          if (project.description) {
            yPosition += 1;
            addBulletPoints(project.description, 5);
          }
          // Project link
          if (project.link) {
            pdf.setFontSize(8);
            pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
            pdf.text(cleanText(project.link), margin, yPosition);
            yPosition += 6;
          } else {
            yPosition += 4;
          }
        }
      }

      // ADDITIONAL SECTIONS - Certifications, Languages, Interests
      const hasAdditionalSections = (resumeData.certifications?.length > 0) ||
                                   (resumeData.languages?.length > 0) ||
                                   (resumeData.interests?.length > 0);

      if (hasAdditionalSections) {
        checkPageBreak(30);
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        const columnWidth = (pageWidth - 3 * margin) / 2;

        // Certifications (LEFT)
        if (resumeData.certifications?.length > 0) {
          addSectionHeader('Certifications');
          pdf.setFontSize(8.5);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          for (const cert of resumeData.certifications) {
            const certText = `• ${cleanText(cert.name)} - ${cleanText(cert.issuer)} (${cleanText(cert.date)})`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            for (const line of lines) {
              pdf.text(line, margin, leftColumnY);
              leftColumnY += 4;
            }
            leftColumnY += 2;
          }
        }

        // Languages (RIGHT)
        if (resumeData.languages?.length > 0) {
          addSectionHeader('Languages');
          const rightColumnX = margin + columnWidth + margin;
          pdf.setFontSize(8.5);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0);
          for (const lang of resumeData.languages) {
            pdf.text(`• ${cleanText(lang.language)} (${cleanText(lang.proficiency)})`, rightColumnX, rightColumnY);
            rightColumnY += 4;
          }
        }

        // Move yPosition down so as not to overlap further sections
        yPosition = Math.max(leftColumnY, rightColumnY) + 8;

        // Interests, centered and as a list
        if (resumeData.interests?.length > 0) {
          checkPageBreak(12);
          addSectionHeader('Interests');
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
