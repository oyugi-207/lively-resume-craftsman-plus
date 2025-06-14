
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Enhanced template-specific styling for modern design
      const getTemplateStyle = (templateId: number) => {
        const styles = {
          0: { // Modern Professional
            primaryColor: [59, 130, 246],
            secondaryColor: [71, 85, 105],
            accentColor: [16, 185, 129],
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 40
          },
          1: { // Executive
            primaryColor: [31, 41, 55],
            secondaryColor: [75, 85, 99],
            accentColor: [168, 85, 247],
            headerBg: false,
            fontFamily: 'helvetica',
            headerHeight: 35
          },
          2: { // Creative
            primaryColor: [147, 51, 234],
            secondaryColor: [236, 72, 153],
            accentColor: [59, 130, 246],
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 42
          },
          3: { // Tech
            primaryColor: [34, 197, 94],
            secondaryColor: [55, 65, 81],
            accentColor: [59, 130, 246],
            headerBg: true,
            fontFamily: 'courier',
            headerHeight: 40
          },
          4: { // Minimalist
            primaryColor: [75, 85, 99],
            secondaryColor: [156, 163, 175],
            accentColor: [59, 130, 246],
            headerBg: false,
            fontFamily: 'helvetica',
            headerHeight: 30
          },
          5: { // Corporate Classic
            primaryColor: [31, 41, 55],
            secondaryColor: [107, 114, 128],
            accentColor: [168, 85, 247],
            headerBg: false,
            fontFamily: 'times',
            headerHeight: 35
          }
        };
        return styles[templateId as keyof typeof styles] || styles[0];
      };

      const style = getTemplateStyle(templateId);

      // Helper functions
      const setColor = (color: number[]) => {
        pdf.setTextColor(color[0], color[1], color[2]);
      };

      const addNewPageIfNeeded = (requiredSpace: number = 15) => {
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
        addNewPageIfNeeded(12);
        
        // Modern section header with enhanced styling
        pdf.setFontSize(11);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        
        // Add subtle background rectangle
        const lightColor = style.primaryColor.map(c => Math.min(255, c + 190));
        pdf.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        pdf.rect(margin - 2, yPosition - 3, pageWidth - 2 * margin + 4, 8, 'F');
        
        pdf.text(title.toUpperCase(), margin, yPosition);
        
        // Modern underline
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(0.4);
        pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
        
        yPosition += 10;
        return yPosition;
      };

      const addText = (text: string, fontSize = 10, fontWeight = 'normal', color = [0, 0, 0], indent = 0) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        addNewPageIfNeeded(fontSize + 2);
        
        pdf.setFontSize(fontSize);
        pdf.setFont(style.fontFamily, fontWeight);
        setColor(color);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText, maxWidth);
        
        for (const line of lines) {
          addNewPageIfNeeded(fontSize * 0.4);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.4;
        }
        
        return yPosition + 2;
      };

      const addBulletPoints = (text: string, fontSize = 9) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        
        // Enhanced bullet point parsing
        const sentences = cleanText
          .split(/[.\n•·‣▪▫-]/)
          .map(sentence => sentence.trim())
          .filter(sentence => sentence && sentence.length > 10);
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          if (sentence) {
            addNewPageIfNeeded(fontSize + 2);
            
            pdf.setFontSize(fontSize);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            // Modern bullet point design
            pdf.setFillColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
            pdf.circle(margin + 5, yPosition - 1, 0.8, 'F');
            
            // Clean the sentence
            const cleanedSentence = sentence.replace(/^[•·‣▪▫-]\s*/, '').trim();
            
            // Add bullet text with proper wrapping
            const maxWidth = pageWidth - 2 * margin - 12;
            const wrappedLines = pdf.splitTextToSize(cleanedSentence, maxWidth);
            
            let lineY = yPosition;
            for (let j = 0; j < wrappedLines.length; j++) {
              if (j > 0) {
                addNewPageIfNeeded(fontSize * 0.4);
                lineY += fontSize * 0.4;
              }
              pdf.text(wrappedLines[j], margin + 12, lineY);
            }
            
            yPosition = lineY + fontSize * 0.5;
          }
        }
        
        return yPosition + 3;
      };

      // Add hidden job description for ATS (completely invisible)
      const addHiddenJobDescription = (jobDesc?: string) => {
        if (jobDesc && jobDesc.trim().length > 20) {
          pdf.setTextColor(255, 255, 255); // White text (invisible)
          pdf.setFontSize(0.1); // Extremely tiny font
          
          // Split job description into keywords
          const keywords = jobDesc
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 50)
            .join(' ');
          
          // Add keywords at bottom of page (invisible)
          const hiddenText = `ATS_KEYWORDS: ${keywords}`;
          const chunks = hiddenText.match(/.{1,80}/g) || [hiddenText];
          let hiddenY = pageHeight - 10;
          
          for (const chunk of chunks.slice(0, 3)) {
            if (hiddenY < pageHeight - 2) {
              pdf.text(chunk, margin, hiddenY);
              hiddenY += 1;
            }
          }
          
          // Reset text color
          pdf.setTextColor(0, 0, 0);
        }
      };

      // Enhanced modern header rendering with proper personal info
      if (style.headerBg) {
        // Header background
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.rect(0, 0, pageWidth, style.headerHeight, 'F');
        
        // Name with enhanced typography
        pdf.setFontSize(20);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(255, 255, 255);
        const nameText = resumeData.personal?.fullName || 'Your Name';
        pdf.text(nameText, margin, 18);
        
        // Professional subtitle from summary
        if (resumeData.personal?.summary) {
          const titleLine = resumeData.personal.summary.split('.')[0].substring(0, 50) + '...';
          pdf.setFontSize(10);
          pdf.setTextColor(240, 240, 240);
          pdf.text(titleLine, margin, 26);
        }
        
        // Contact information in header
        pdf.setFontSize(8);
        pdf.setTextColor(230, 230, 230);
        const contactInfo = [];
        if (resumeData.personal?.email) contactInfo.push(resumeData.personal.email);
        if (resumeData.personal?.phone) contactInfo.push(resumeData.personal.phone);
        if (resumeData.personal?.location) contactInfo.push(resumeData.personal.location);
        
        if (contactInfo.length > 0) {
          pdf.text(contactInfo.join(' • '), margin, 33);
        }
        
        yPosition = style.headerHeight + 8;
      } else {
        // Modern centered header without background
        pdf.setFontSize(22);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        const nameText = resumeData.personal?.fullName || 'Your Name';
        const nameWidth = pdf.getTextWidth(nameText);
        pdf.text(nameText, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 6;

        // Professional line under name
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(0.8);
        pdf.line((pageWidth - nameWidth) / 2, yPosition, (pageWidth + nameWidth) / 2, yPosition);
        yPosition += 4;

        // Contact information
        pdf.setFontSize(9);
        pdf.setFont(style.fontFamily, 'normal');
        setColor(style.secondaryColor);
        const contactInfo = [];
        if (resumeData.personal?.email) contactInfo.push(resumeData.personal.email);
        if (resumeData.personal?.phone) contactInfo.push(resumeData.personal.phone);
        if (resumeData.personal?.location) contactInfo.push(resumeData.personal.location);
        
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' • ');
          const contactWidth = pdf.getTextWidth(contactText);
          pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 4;
        }

        yPosition += 6;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        yPosition = addSectionHeader('Professional Summary');
        yPosition = addText(resumeData.personal.summary, 9, 'normal', [0, 0, 0]);
        yPosition += 3;
      }

      // Professional Experience
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          addNewPageIfNeeded(15);
          
          // Job title
          yPosition = addText(exp.position || 'Position', 10, 'bold', [0, 0, 0]);
          
          // Company and dates
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
          const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
          
          const companyLine = `${exp.company || 'Company'}${dateRange ? ` | ${dateRange}` : ''}`;
          yPosition = addText(companyLine, 9, 'normal', style.primaryColor);
          
          // Location
          if (exp.location) {
            yPosition = addText(exp.location, 8, 'italic', style.secondaryColor);
          }
          
          // Description with bullet formatting
          if (exp.description) {
            yPosition = addBulletPoints(exp.description, 8);
          }
          
          yPosition += 4;
        }
      }

      // Projects Section
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          addNewPageIfNeeded(12);
          
          yPosition = addText(project.name || 'Project Name', 10, 'bold', [0, 0, 0]);
          
          if (project.technologies) {
            yPosition = addText(`Technologies: ${project.technologies}`, 8, 'italic', style.secondaryColor);
          }
          
          if (project.description) {
            yPosition = addBulletPoints(project.description, 8);
          }
          
          if (project.link) {
            yPosition = addText(`Link: ${project.link}`, 7, 'normal', style.primaryColor);
          }
          
          yPosition += 3;
        }
      }

      // Education
      if (resumeData.education?.length > 0) {
        yPosition = addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          addNewPageIfNeeded(8);
          
          yPosition = addText(edu.degree || 'Degree', 9, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'}${edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : ''}`;
          yPosition = addText(schoolLine, 8, 'normal', style.primaryColor);
          
          if (edu.location) {
            yPosition = addText(edu.location, 8, 'italic', style.secondaryColor);
          }
          
          if (edu.gpa) {
            yPosition = addText(`GPA: ${edu.gpa}`, 8, 'normal', [0, 0, 0]);
          }
          yPosition += 2;
        }
      }

      // Skills Section with modern layout
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies');
        
        const skillsPerLine = templateId === 3 ? 3 : 4;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          addNewPageIfNeeded(6);
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          
          // Modern skill pills
          let xPosition = margin;
          for (const skill of skillGroup) {
            const skillWidth = pdf.getTextWidth(skill) + 6;
            
            // Skill background
            const lightAccent = style.accentColor.map(c => Math.min(255, c + 180));
            pdf.setFillColor(lightAccent[0], lightAccent[1], lightAccent[2]);
            pdf.rect(xPosition, yPosition - 2, skillWidth, 5, 'F');
            
            // Skill text
            pdf.setFontSize(7);
            pdf.setFont(style.fontFamily, 'normal');
            setColor(style.primaryColor);
            pdf.text(skill, xPosition + 3, yPosition);
            
            xPosition += skillWidth + 4;
            if (xPosition > pageWidth - margin - 30) break;
          }
          
          yPosition += 7;
        }
        yPosition += 2;
      }

      // Additional sections in columns
      const hasMoreSections = (resumeData.certifications?.length > 0) || 
                             (resumeData.languages?.length > 0) || 
                             (resumeData.interests?.length > 0);
      
      if (hasMoreSections) {
        const remainingSpace = pageHeight - yPosition - 20;
        if (remainingSpace < 20) {
          addNewPageIfNeeded(20);
        }

        const columnWidth = (pageWidth - 3 * margin) / 2;
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        
        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          leftColumnY = yPosition;
          
          pdf.setFontSize(9);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 4;
          
          for (const cert of resumeData.certifications) {
            if (leftColumnY > pageHeight - 10) {
              addNewPageIfNeeded(10);
              leftColumnY = yPosition;
            }
            
            pdf.setFontSize(7);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cert.name} - ${cert.issuer} (${cert.date})`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            for (const line of lines) {
              pdf.text(line, margin, leftColumnY);
              leftColumnY += 3;
            }
          }
        }

        // Right column - Languages
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          rightColumnY = Math.max(yPosition, leftColumnY - 10);
          
          pdf.setFontSize(9);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 4;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY < pageHeight - 8) {
              pdf.setFontSize(7);
              pdf.setFont(style.fontFamily, 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
              rightColumnY += 3;
            }
          }
        }

        // Interests section
        if (resumeData.interests?.length > 0) {
          const maxColumnY = Math.max(leftColumnY, rightColumnY);
          yPosition = maxColumnY + 3;
          addNewPageIfNeeded(8);
          
          pdf.setFontSize(9);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 3;
          
          const interestsText = resumeData.interests.slice(0, 10).join(' • ');
          pdf.setFontSize(7);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setTextColor(0, 0, 0);
          yPosition = addText(interestsText, 7, 'normal', [0, 0, 0]);
        }
      }

      // Add hidden job description for ATS optimization
      addHiddenJobDescription(jobDescription);

      // Set clean PDF metadata
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Resume'} - Professional Resume`,
        subject: 'Professional Resume - ATS Optimized',
        author: resumeData.personal?.fullName || 'Professional',
        creator: 'Resume Builder Pro - ATS Enhanced',
        keywords: resumeData.skills?.slice(0, 15).join(', ') || 'Professional Resume'
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
    
    return [...new Set(relevantWords)].slice(0, 15);
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename, jobDescription);
  }
}

export default PDFGenerator;
