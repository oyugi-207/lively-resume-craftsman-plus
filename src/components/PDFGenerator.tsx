
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      let yPosition = margin;

      // Enhanced template-specific configurations with better colors
      const templateConfigs = {
        0: { // Modern Professional
          primaryColor: [41, 98, 255] as [number, number, number], // Modern blue
          secondaryColor: [71, 85, 105] as [number, number, number], // Slate gray
          accentColor: [16, 185, 129] as [number, number, number], // Emerald
          headerStyle: 'modern',
          fontStyle: 'professional'
        },
        1: { // Executive Leadership
          primaryColor: [30, 41, 59] as [number, number, number], // Dark slate
          secondaryColor: [100, 116, 139] as [number, number, number], // Medium slate
          accentColor: [59, 130, 246] as [number, number, number], // Blue
          headerStyle: 'executive',
          fontStyle: 'bold'
        },
        2: { // Classic Corporate
          primaryColor: [55, 65, 81] as [number, number, number], // Gray
          secondaryColor: [107, 114, 128] as [number, number, number], // Light gray
          accentColor: [147, 51, 234] as [number, number, number], // Purple
          headerStyle: 'classic',
          fontStyle: 'traditional'
        },
        3: { // Creative Designer
          primaryColor: [147, 51, 234] as [number, number, number], // Purple
          secondaryColor: [236, 72, 153] as [number, number, number], // Pink
          accentColor: [249, 115, 22] as [number, number, number], // Orange
          headerStyle: 'creative',
          fontStyle: 'modern'
        },
        4: { // Tech Specialist
          primaryColor: [6, 182, 212] as [number, number, number], // Cyan
          secondaryColor: [14, 165, 233] as [number, number, number], // Sky blue
          accentColor: [34, 197, 94] as [number, number, number], // Green
          headerStyle: 'tech',
          fontStyle: 'clean'
        }
      };

      const config = templateConfigs[templateId] || templateConfigs[0];

      // Clean text helper
      const cleanText = (text: string): string => {
        return text?.replace(/[^\x20-\x7E]/g, '').trim() || '';
      };

      // Enhanced template-specific header rendering with sans-serif fonts
      const renderHeader = () => {
        if (!resumeData.personal?.fullName) return;

        switch (config.headerStyle) {
          case 'executive':
            // Executive style header
            pdf.setFontSize(26);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            const nameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - nameWidth) / 2, yPosition);
            yPosition += 12;
            break;
            
          case 'creative':
            // Creative style header with enhanced background
            pdf.setFillColor(...config.primaryColor);
            pdf.rect(0, 0, pageWidth, 28, 'F');
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(255, 255, 255);
            const creativeNameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - creativeNameWidth) / 2, 18);
            yPosition = 35;
            break;
            
          case 'tech':
            // Tech style header with enhanced accent
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            pdf.text(cleanText(resumeData.personal.fullName), margin, yPosition);
            yPosition += 10;
            // Enhanced tech accent line with gradient effect
            pdf.setDrawColor(...config.accentColor);
            pdf.setLineWidth(3);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
            break;
            
          default: // Modern Professional and others
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            const modernNameWidth = pdf.getTextWidth(cleanText(resumeData.personal.fullName));
            pdf.text(cleanText(resumeData.personal.fullName), (pageWidth - modernNameWidth) / 2, yPosition);
            yPosition += 10;
        }

        // Enhanced contact info with better styling
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...config.secondaryColor);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
        if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
        if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));
        
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' • ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 8;
        }

        // Enhanced separator line
        if (config.headerStyle !== 'creative') {
          pdf.setDrawColor(...config.accentColor);
          pdf.setLineWidth(1);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 12;
        } else {
          yPosition += 8;
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

      // Enhanced section header with better typography
      const addSectionHeader = (title: string) => {
        checkPageBreak(18);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...config.primaryColor);
        
        // Left-aligned section headers for better readability
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 8;
        
        // Enhanced underline with accent color
        pdf.setDrawColor(...config.accentColor);
        pdf.setLineWidth(2);
        const headerWidth = pdf.getTextWidth(title.toUpperCase());
        pdf.line(margin, yPosition, margin + headerWidth, yPosition);
        yPosition += 10;
      };

      // Enhanced text helper with better spacing
      const addText = (text: string, fontSize = 10, fontStyle = 'normal', indent = 0) => {
        if (!text) return;
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(50, 50, 50); // Softer black for better readability
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText(text), maxWidth);
        
        for (const line of lines) {
          checkPageBreak(fontSize * 0.6);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.6;
        }
        yPosition += 3;
      };

      // Enhanced bullet points with modern styling
      const addBulletPoints = (text: string, indent = 12) => {
        if (!text) return;
        
        const bullets = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        for (const bullet of bullets) {
          checkPageBreak(12);
          
          let bulletText = bullet;
          const bulletSymbol = config.headerStyle === 'creative' ? '▶' : '●';
          if (!bulletText.match(/^[•·‣▪▫▸▶●-]\s/)) {
            bulletText = `${bulletSymbol} ${bulletText.replace(/^[•·‣▪▫▸▶●-]*\s*/, '')}`;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 60, 60);
          
          const maxWidth = pageWidth - 2 * margin - indent;
          const wrappedLines = pdf.splitTextToSize(cleanText(bulletText), maxWidth);
          
          for (let i = 0; i < wrappedLines.length; i++) {
            if (i > 0) checkPageBreak(10);
            pdf.text(wrappedLines[i], margin + indent, yPosition);
            yPosition += 5.5;
          }
          yPosition += 2;
        }
      };

      // Render enhanced header
      renderHeader();

      // Professional Summary with enhanced styling
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary');
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(40, 40, 40);
        addText(resumeData.personal.summary, 11, 'normal');
        yPosition += 6;
      }

      // Experience with enhanced template-specific styling
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          checkPageBreak(30);
          
          // Enhanced job title styling
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text(cleanText(exp.position || 'Position'), margin, yPosition);
          yPosition += 6;
          
          // Enhanced company and dates styling
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.secondaryColor);
          
          const companyInfo = cleanText(exp.company || 'Company');
          let dateInfo = '';
          
          if (exp.startDate || exp.endDate) {
            const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
            const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
            dateInfo = ` • ${startDate} - ${endDate}`;
          }
          
          pdf.text(companyInfo + dateInfo, margin, yPosition);
          yPosition += 5;
          
          if (exp.location) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(...config.secondaryColor);
            pdf.text(cleanText(exp.location), margin, yPosition);
            yPosition += 5;
          }
          
          // Enhanced description with better bullets
          if (exp.description) {
            yPosition += 2;
            addBulletPoints(exp.description, 8);
          }
          yPosition += 8;
        }
      }

      // Enhanced education section
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          checkPageBreak(25);
          
          // Enhanced degree styling
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text(cleanText(edu.degree || 'Degree'), margin, yPosition);
          yPosition += 6;
          
          // Enhanced school and date styling
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.secondaryColor);
          
          const schoolInfo = cleanText(edu.school || 'School');
          const eduDate = edu.endDate ? ` • ${new Date(edu.endDate + '-01').getFullYear()}` : '';
          pdf.text(schoolInfo + eduDate, margin, yPosition);
          yPosition += 5;
          
          // Enhanced additional education details
          if (edu.location) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(...config.secondaryColor);
            pdf.text(cleanText(edu.location), margin, yPosition);
            yPosition += 4;
          }
          
          if (edu.gpa) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...config.accentColor);
            pdf.text(`GPA: ${cleanText(edu.gpa)}`, margin, yPosition);
            yPosition += 4;
          }
          
          if (edu.description) {
            yPosition += 2;
            addText(edu.description, 9, 'normal', 6);
          }
          
          yPosition += 8;
        }
      }

      // Enhanced Core Competencies section with modern grid layout
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies');
        
        const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
        const skillsArray = typeof skills[0] === 'object' 
          ? skills.map((skill: any) => skill.name || skill) 
          : skills;
        
        if (skillsArray.length > 0) {
          // Create a modern grid layout for skills
          const skillsPerRow = 3;
          const columnWidth = (pageWidth - 2 * margin) / skillsPerRow;
          let currentRow = 0;
          let currentCol = 0;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          
          for (let i = 0; i < skillsArray.length; i++) {
            const skill = cleanText(skillsArray[i]);
            if (!skill) continue;
            
            checkPageBreak(12);
            
            const xPosition = margin + (currentCol * columnWidth);
            
            // Add skill with bullet and accent color
            pdf.setTextColor(...config.accentColor);
            pdf.text('●', xPosition, yPosition);
            
            pdf.setTextColor(50, 50, 50);
            pdf.text(skill, xPosition + 5, yPosition);
            
            currentCol++;
            if (currentCol >= skillsPerRow) {
              currentCol = 0;
              currentRow++;
              yPosition += 6;
            }
          }
          
          // Add spacing after the last row
          if (currentCol > 0) {
            yPosition += 6;
          }
          yPosition += 8;
        }
      }

      // Enhanced Projects section
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          checkPageBreak(30);
          
          // Enhanced project name styling
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text(cleanText(project.name || 'Project'), margin, yPosition);
          yPosition += 6;
          
          // Enhanced date range and technologies
          if (project.startDate || project.endDate || project.technologies) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...config.secondaryColor);
            
            const projectDetails = [];
            if (project.startDate || project.endDate) {
              const startDate = project.startDate || '';
              const endDate = project.endDate || 'Present';
              projectDetails.push(`${startDate} - ${endDate}`);
            }
            
            if (project.technologies) {
              projectDetails.push(`Technologies: ${cleanText(project.technologies)}`);
            }
            
            if (projectDetails.length > 0) {
              pdf.text(projectDetails.join(' • '), margin, yPosition);
              yPosition += 5;
            }
          }
          
          // Enhanced project description
          if (project.description) {
            yPosition += 2;
            addBulletPoints(project.description, 8);
          }
          
          // Project link with accent color
          if (project.link) {
            pdf.setFontSize(9);
            pdf.setTextColor(...config.accentColor);
            pdf.text(`🔗 ${cleanText(project.link)}`, margin, yPosition);
            yPosition += 8;
          } else {
            yPosition += 6;
          }
        }
      }

      // Enhanced additional sections with modern two-column layout
      const hasAdditionalSections = (resumeData.certifications?.length > 0) || 
                                   (resumeData.languages?.length > 0) || 
                                   (resumeData.interests?.length > 0);

      if (hasAdditionalSections) {
        checkPageBreak(40);
        
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        const columnWidth = (pageWidth - 3 * margin) / 2;

        // Enhanced Certifications section
        if (resumeData.certifications?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 8;
          
          // Add underline
          pdf.setDrawColor(...config.accentColor);
          pdf.setLineWidth(1);
          pdf.line(margin, leftColumnY, margin + pdf.getTextWidth('CERTIFICATIONS'), leftColumnY);
          leftColumnY += 6;
          
          for (const cert of resumeData.certifications) {
            if (leftColumnY > pageHeight - 30) break;
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(...config.primaryColor);
            pdf.text(`● ${cleanText(cert.name)}`, margin, leftColumnY);
            leftColumnY += 4;
            
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...config.secondaryColor);
            pdf.text(`   ${cleanText(cert.issuer)} (${cleanText(cert.date)})`, margin, leftColumnY);
            leftColumnY += 6;
          }
        }

        // Enhanced Languages section
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 8;
          
          // Add underline
          pdf.setDrawColor(...config.accentColor);
          pdf.setLineWidth(1);
          pdf.line(rightColumnX, rightColumnY, rightColumnX + pdf.getTextWidth('LANGUAGES'), rightColumnY);
          rightColumnY += 6;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY > pageHeight - 30) break;
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(50, 50, 50);
            pdf.text(`● ${cleanText(lang.language)} - ${cleanText(lang.proficiency)}`, rightColumnX, rightColumnY);
            rightColumnY += 5;
          }
        }

        yPosition = Math.max(leftColumnY, rightColumnY) + 10;

        // Enhanced Interests section
        if (resumeData.interests?.length > 0) {
          checkPageBreak(15);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...config.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 8;
          
          // Add underline
          pdf.setDrawColor(...config.accentColor);
          pdf.setLineWidth(1);
          pdf.line(margin, yPosition, margin + pdf.getTextWidth('INTERESTS'), yPosition);
          yPosition += 6;
          
          const interestsText = resumeData.interests
            .filter((interest: string) => interest && interest.trim())
            .map((interest: string) => cleanText(interest))
            .join(' • ');
          
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(50, 50, 50);
          addText(interestsText, 9, 'normal');
        }
      }

      // Save the enhanced PDF
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
