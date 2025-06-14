
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Enhanced template-specific styling with better colors
      const getTemplateStyle = (templateId: number) => {
        const styles = {
          0: { // Modern Professional - Blue theme
            primaryColor: [31, 81, 140],     // Deep blue
            secondaryColor: [51, 65, 85],    // Slate gray
            accentColor: [59, 130, 246],     // Bright blue
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 65
          },
          1: { // Executive - Dark theme
            primaryColor: [17, 24, 39],      // Very dark gray
            secondaryColor: [55, 65, 81],    // Dark gray
            accentColor: [139, 92, 246],     // Purple
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 65
          },
          2: { // Creative - Gradient theme
            primaryColor: [91, 33, 182],     // Purple
            secondaryColor: [219, 39, 119],  // Pink
            accentColor: [59, 130, 246],     // Blue
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 65
          },
          3: { // Tech - Green theme
            primaryColor: [5, 150, 105],     // Emerald
            secondaryColor: [31, 41, 55],    // Dark gray
            accentColor: [16, 185, 129],     // Green
            headerBg: true,
            fontFamily: 'courier',
            headerHeight: 65
          },
          4: { // Minimalist - Clean
            primaryColor: [55, 65, 81],      // Gray
            secondaryColor: [107, 114, 128], // Light gray
            accentColor: [79, 70, 229],      // Indigo
            headerBg: false,
            fontFamily: 'helvetica',
            headerHeight: 55
          },
          5: { // Corporate Classic
            primaryColor: [30, 58, 138],     // Navy blue
            secondaryColor: [75, 85, 99],    // Gray
            accentColor: [147, 51, 234],     // Purple
            headerBg: false,
            fontFamily: 'times',
            headerHeight: 55
          }
        };
        return styles[templateId as keyof typeof styles] || styles[0];
      };

      const style = getTemplateStyle(templateId);

      // Helper functions
      const setColor = (color: number[]) => {
        pdf.setTextColor(color[0], color[1], color[2]);
      };

      const addNewPageIfNeeded = (requiredSpace: number = 25) => {
        if (yPosition > pageHeight - requiredSpace) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      const cleanAndFormatText = (text: string): string => {
        if (!text) return '';
        return text
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/\u0008/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const addSectionHeader = (title: string) => {
        addNewPageIfNeeded(20);
        
        pdf.setFontSize(14);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        
        // Modern section background
        const lightColor = style.primaryColor.map(c => Math.min(255, c + 210));
        pdf.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        pdf.rect(margin - 5, yPosition - 6, pageWidth - 2 * margin + 10, 12, 'F');
        
        pdf.text(title.toUpperCase(), margin, yPosition);
        
        // Enhanced underline
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(1);
        pdf.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);
        
        yPosition += 18;
        return yPosition;
      };

      const addText = (text: string, fontSize = 11, fontWeight = 'normal', color = [0, 0, 0], indent = 0) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        addNewPageIfNeeded(fontSize + 6);
        
        pdf.setFontSize(fontSize);
        pdf.setFont(style.fontFamily, fontWeight);
        setColor(color);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText, maxWidth);
        
        for (const line of lines) {
          addNewPageIfNeeded(fontSize * 0.7);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.7;
        }
        
        return yPosition + 4;
      };

      const addBulletPoints = (text: string, fontSize = 10) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        
        const sentences = cleanText
          .split(/[.\n•·‣▪▫-]/)
          .map(sentence => sentence.trim())
          .filter(sentence => sentence && sentence.length > 15);
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          if (sentence) {
            addNewPageIfNeeded(fontSize + 4);
            
            pdf.setFontSize(fontSize);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            // Enhanced bullet point
            pdf.setFillColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
            pdf.circle(margin + 8, yPosition - 2, 1.5, 'F');
            
            const cleanedSentence = sentence.replace(/^[•·‣▪▫-]\s*/, '').trim();
            
            const maxWidth = pageWidth - 2 * margin - 20;
            const wrappedLines = pdf.splitTextToSize(cleanedSentence, maxWidth);
            
            let lineY = yPosition;
            for (let j = 0; j < wrappedLines.length; j++) {
              if (j > 0) {
                addNewPageIfNeeded(fontSize * 0.7);
                lineY += fontSize * 0.7;
              }
              pdf.text(wrappedLines[j], margin + 18, lineY);
            }
            
            yPosition = lineY + fontSize * 0.8;
          }
        }
        
        return yPosition + 6;
      };

      // Invisible ATS optimization
      const addInvisibleATSContent = (jobDesc?: string) => {
        if (jobDesc && jobDesc.trim().length > 20) {
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(0.1);
          
          const keywords = jobDesc
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 150)
            .join(' ');
          
          const hiddenContent = `ATS_KEYWORDS: ${keywords} RESUME_OPTIMIZED_FOR_ATS_SCANNING_SYSTEM`;
          pdf.text(hiddenContent.substring(0, 200), 1, pageHeight - 2);
          pdf.setTextColor(0, 0, 0);
        }
      };

      // ENHANCED HEADER - Fixed personal info display
      if (style.headerBg) {
        // Gradient header background
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.rect(0, 0, pageWidth, style.headerHeight, 'F');
        
        // Add subtle gradient effect
        const gradientColor = style.primaryColor.map(c => Math.max(0, c - 30));
        pdf.setFillColor(gradientColor[0], gradientColor[1], gradientColor[2]);
        pdf.rect(0, style.headerHeight - 10, pageWidth, 10, 'F');
        
        // NAME - Large and prominent
        const fullName = resumeData.personal?.fullName || 'Professional Name';
        pdf.setFontSize(28);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(fullName, margin, 25);
        
        // PROFESSIONAL TITLE - Extract from experience or use summary
        let professionalTitle = '';
        if (resumeData.experience && resumeData.experience.length > 0) {
          professionalTitle = resumeData.experience[0].position || '';
        } else if (resumeData.personal?.summary) {
          // Extract a professional title from summary
          const summaryWords = resumeData.personal.summary.split(' ');
          if (summaryWords.length > 2) {
            professionalTitle = summaryWords.slice(0, 6).join(' ');
          }
        }
        
        if (professionalTitle) {
          pdf.setFontSize(14);
          pdf.setTextColor(240, 240, 240);
          pdf.text(professionalTitle, margin, 35);
        }
        
        // CONTACT INFORMATION - Professional layout
        pdf.setFontSize(11);
        pdf.setTextColor(230, 230, 230);
        const contactItems = [];
        if (resumeData.personal?.email) contactItems.push(resumeData.personal.email);
        if (resumeData.personal?.phone) contactItems.push(resumeData.personal.phone);
        if (resumeData.personal?.location) contactItems.push(resumeData.personal.location);
        
        if (contactItems.length > 0) {
          const contactText = contactItems.join(' • ');
          pdf.text(contactText, margin, 45);
        }
        
        yPosition = style.headerHeight + 15;
      } else {
        // Clean header without background
        const fullName = resumeData.personal?.fullName || 'Professional Name';
        pdf.setFontSize(32);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        const nameWidth = pdf.getTextWidth(fullName);
        pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 12;

        // Professional divider line
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(2);
        pdf.line((pageWidth - nameWidth) / 2, yPosition, (pageWidth + nameWidth) / 2, yPosition);
        yPosition += 10;

        // Contact information
        pdf.setFontSize(11);
        pdf.setFont(style.fontFamily, 'normal');
        setColor(style.secondaryColor);
        const contactItems = [];
        if (resumeData.personal?.email) contactItems.push(resumeData.personal.email);
        if (resumeData.personal?.phone) contactItems.push(resumeData.personal.phone);
        if (resumeData.personal?.location) contactItems.push(resumeData.personal.location);
        
        if (contactItems.length > 0) {
          const contactText = contactItems.join(' • ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 8;
        }

        yPosition += 12;
      }

      // PROFESSIONAL SUMMARY
      if (resumeData.personal?.summary) {
        yPosition = addSectionHeader('Professional Summary');
        yPosition = addText(resumeData.personal.summary, 11, 'normal', [0, 0, 0]);
        yPosition += 8;
      }

      // PROFESSIONAL EXPERIENCE
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          addNewPageIfNeeded(25);
          
          // Job title - bold and prominent
          yPosition = addText(exp.position || 'Position', 13, 'bold', [0, 0, 0]);
          
          // Company and dates
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
          const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
          
          const companyLine = `${exp.company || 'Company'}${dateRange ? ` | ${dateRange}` : ''}`;
          yPosition = addText(companyLine, 11, 'bold', style.primaryColor);
          
          // Location
          if (exp.location) {
            yPosition = addText(exp.location, 10, 'italic', style.secondaryColor);
          }
          
          // Description with enhanced bullet formatting
          if (exp.description) {
            yPosition = addBulletPoints(exp.description, 10);
          }
          
          yPosition += 8;
        }
      }

      // PROJECTS SECTION
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          addNewPageIfNeeded(20);
          
          yPosition = addText(project.name || 'Project Name', 12, 'bold', [0, 0, 0]);
          
          if (project.technologies) {
            yPosition = addText(`Technologies: ${project.technologies}`, 10, 'italic', style.secondaryColor);
          }
          
          if (project.description) {
            yPosition = addBulletPoints(project.description, 10);
          }
          
          if (project.link) {
            yPosition = addText(`Link: ${project.link}`, 9, 'normal', style.primaryColor);
          }
          
          yPosition += 6;
        }
      }

      // EDUCATION
      if (resumeData.education?.length > 0) {
        yPosition = addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          addNewPageIfNeeded(15);
          
          yPosition = addText(edu.degree || 'Degree', 11, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'}${edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : ''}`;
          yPosition = addText(schoolLine, 10, 'normal', style.primaryColor);
          
          if (edu.location) {
            yPosition = addText(edu.location, 9, 'italic', style.secondaryColor);
          }
          
          if (edu.gpa) {
            yPosition = addText(`GPA: ${edu.gpa}`, 9, 'normal', [0, 0, 0]);
          }
          yPosition += 6;
        }
      }

      // SKILLS SECTION - Enhanced design
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies');
        
        const skillsPerLine = templateId === 3 ? 3 : 4;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          addNewPageIfNeeded(10);
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          
          // Enhanced skill pills
          let xPosition = margin;
          for (const skill of skillGroup) {
            const skillWidth = pdf.getTextWidth(skill) + 12;
            
            // Skill background
            const lightAccent = style.accentColor.map(c => Math.min(255, c + 160));
            pdf.setFillColor(lightAccent[0], lightAccent[1], lightAccent[2]);
            pdf.rect(xPosition, yPosition - 4, skillWidth, 8, 'F');
            
            // Skill text
            pdf.setFontSize(9);
            pdf.setFont(style.fontFamily, 'normal');
            setColor(style.primaryColor);
            pdf.text(skill, xPosition + 6, yPosition);
            
            xPosition += skillWidth + 8;
            if (xPosition > pageWidth - margin - 50) break;
          }
          
          yPosition += 12;
        }
        yPosition += 6;
      }

      // ADDITIONAL SECTIONS - Better layout
      const hasMoreSections = (resumeData.certifications?.length > 0) || 
                             (resumeData.languages?.length > 0) || 
                             (resumeData.interests?.length > 0);
      
      if (hasMoreSections) {
        const remainingSpace = pageHeight - yPosition - 30;
        if (remainingSpace < 30) {
          addNewPageIfNeeded(30);
        }

        const columnWidth = (pageWidth - 3 * margin) / 2;
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        
        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          leftColumnY = yPosition;
          
          pdf.setFontSize(12);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 8;
          
          for (const cert of resumeData.certifications) {
            if (leftColumnY > pageHeight - 15) {
              addNewPageIfNeeded(15);
              leftColumnY = yPosition;
            }
            
            pdf.setFontSize(9);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cert.name} - ${cert.issuer} (${cert.date})`;
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
          rightColumnY = Math.max(yPosition, leftColumnY - 15);
          
          pdf.setFontSize(12);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 8;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY < pageHeight - 12) {
              pdf.setFontSize(9);
              pdf.setFont(style.fontFamily, 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
              rightColumnY += 5;
            }
          }
        }

        // Interests section
        if (resumeData.interests?.length > 0) {
          const maxColumnY = Math.max(leftColumnY, rightColumnY);
          yPosition = maxColumnY + 8;
          addNewPageIfNeeded(12);
          
          pdf.setFontSize(12);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 6;
          
          const interestsText = resumeData.interests.slice(0, 12).join(' • ');
          pdf.setFontSize(9);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setTextColor(0, 0, 0);
          yPosition = addText(interestsText, 9, 'normal', [0, 0, 0]);
        }
      }

      // Add invisible ATS optimization
      addInvisibleATSContent(jobDescription);

      // Enhanced PDF metadata
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Resume'} - Professional Resume`,
        subject: 'Professional Resume - ATS Optimized',
        author: resumeData.personal?.fullName || 'Professional',
        creator: 'Resume Builder Pro - AI Enhanced',
        keywords: resumeData.skills?.slice(0, 25).join(', ') || 'Professional Resume'
      });

      // Save the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  // Enhanced keyword extraction for ATS optimization
  static extractRelevantKeywords(jobDescription: string, experienceText: string): string[] {
    if (!jobDescription || !experienceText) return [];
    
    const jobWords = jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const expWords = experienceText.toLowerCase().match(/\b\w{3,}\b/g) || [];
    
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'will', 'can', 'has', 'have', 'had', 'this', 'that', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'all', 'any', 'some', 'more', 'most', 'other', 'such', 'than', 'very', 'just', 'only', 'also', 'even', 'well', 'back', 'still', 'way', 'new', 'old', 'good', 'great', 'first', 'last', 'long', 'own', 'over', 'think', 'time', 'work', 'life', 'day', 'year', 'may', 'come', 'its', 'now', 'people', 'take', 'get', 'use', 'her', 'him', 'his', 'she', 'see', 'go']);
    
    const relevantWords = jobWords.filter(word => 
      !commonWords.has(word) && 
      expWords.includes(word) && 
      word.length > 3
    );
    
    return [...new Set(relevantWords)].slice(0, 25);
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename, jobDescription);
  }
}

export default PDFGenerator;
