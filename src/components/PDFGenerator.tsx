
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Enhanced template-specific styling
      const getTemplateStyle = (templateId: number) => {
        const styles = {
          0: { // Modern Professional
            primaryColor: [59, 130, 246],
            secondaryColor: [71, 85, 105],
            accentColor: [16, 185, 129],
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 50
          },
          1: { // Executive
            primaryColor: [31, 41, 55],
            secondaryColor: [75, 85, 99],
            accentColor: [168, 85, 247],
            headerBg: false,
            fontFamily: 'helvetica',
            headerHeight: 45
          },
          2: { // Creative
            primaryColor: [147, 51, 234],
            secondaryColor: [236, 72, 153],
            accentColor: [59, 130, 246],
            headerBg: true,
            fontFamily: 'helvetica',
            headerHeight: 52
          },
          3: { // Tech
            primaryColor: [34, 197, 94],
            secondaryColor: [55, 65, 81],
            accentColor: [59, 130, 246],
            headerBg: true,
            fontFamily: 'courier',
            headerHeight: 48
          },
          4: { // Minimalist
            primaryColor: [75, 85, 99],
            secondaryColor: [156, 163, 175],
            accentColor: [59, 130, 246],
            headerBg: false,
            fontFamily: 'helvetica',
            headerHeight: 40
          },
          5: { // Corporate Classic
            primaryColor: [31, 41, 55],
            secondaryColor: [107, 114, 128],
            accentColor: [168, 85, 247],
            headerBg: false,
            fontFamily: 'times',
            headerHeight: 45
          }
        };
        return styles[templateId as keyof typeof styles] || styles[0];
      };

      const style = getTemplateStyle(templateId);

      // Helper functions
      const setColor = (color: number[]) => {
        pdf.setTextColor(color[0], color[1], color[2]);
      };

      const addNewPageIfNeeded = (requiredSpace: number = 20) => {
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
        addNewPageIfNeeded(15);
        
        pdf.setFontSize(12);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        
        // Add section background
        const lightColor = style.primaryColor.map(c => Math.min(255, c + 200));
        pdf.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        pdf.rect(margin - 3, yPosition - 4, pageWidth - 2 * margin + 6, 10, 'F');
        
        pdf.text(title.toUpperCase(), margin, yPosition);
        
        // Modern underline
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 15;
        return yPosition;
      };

      const addText = (text: string, fontSize = 10, fontWeight = 'normal', color = [0, 0, 0], indent = 0) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        addNewPageIfNeeded(fontSize + 4);
        
        pdf.setFontSize(fontSize);
        pdf.setFont(style.fontFamily, fontWeight);
        setColor(color);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText, maxWidth);
        
        for (const line of lines) {
          addNewPageIfNeeded(fontSize * 0.5);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.6;
        }
        
        return yPosition + 3;
      };

      const addBulletPoints = (text: string, fontSize = 9) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        
        const sentences = cleanText
          .split(/[.\n•·‣▪▫-]/)
          .map(sentence => sentence.trim())
          .filter(sentence => sentence && sentence.length > 10);
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          if (sentence) {
            addNewPageIfNeeded(fontSize + 3);
            
            pdf.setFontSize(fontSize);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            // Modern bullet point
            pdf.setFillColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
            pdf.circle(margin + 6, yPosition - 1.5, 1, 'F');
            
            const cleanedSentence = sentence.replace(/^[•·‣▪▫-]\s*/, '').trim();
            
            const maxWidth = pageWidth - 2 * margin - 15;
            const wrappedLines = pdf.splitTextToSize(cleanedSentence, maxWidth);
            
            let lineY = yPosition;
            for (let j = 0; j < wrappedLines.length; j++) {
              if (j > 0) {
                addNewPageIfNeeded(fontSize * 0.6);
                lineY += fontSize * 0.6;
              }
              pdf.text(wrappedLines[j], margin + 15, lineY);
            }
            
            yPosition = lineY + fontSize * 0.7;
          }
        }
        
        return yPosition + 4;
      };

      // Add completely invisible ATS optimization content
      const addInvisibleATSContent = (jobDesc?: string) => {
        if (jobDesc && jobDesc.trim().length > 20) {
          // Save current state
          const currentTextColor = pdf.getTextColor();
          
          // Set completely invisible (white on white)
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(0.01); // Extremely tiny
          
          // Extract and embed keywords invisibly
          const keywords = jobDesc
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 100)
            .join(' ');
          
          // Add invisible content at bottom margin
          const invisibleContent = `ATS_OPTIMIZATION_KEYWORDS: ${keywords} RESUME_ENHANCED_FOR_APPLICANT_TRACKING_SYSTEM`;
          const chunks = invisibleContent.match(/.{1,100}/g) || [invisibleContent];
          
          let hiddenY = pageHeight - 8;
          for (const chunk of chunks.slice(0, 5)) {
            if (hiddenY < pageHeight - 2) {
              pdf.text(chunk, 1, hiddenY);
              hiddenY += 0.5;
            }
          }
          
          // Restore text color
          pdf.setTextColor(0, 0, 0);
        }
      };

      // Enhanced header rendering with PROPER personal info display
      if (style.headerBg) {
        // Header background gradient effect
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.rect(0, 0, pageWidth, style.headerHeight, 'F');
        
        // Name - PROPERLY display full name
        pdf.setFontSize(24);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(255, 255, 255);
        const fullName = resumeData.personal?.fullName || 'Your Name';
        pdf.text(fullName, margin, 20);
        
        // Professional title or role (from experience if available)
        let professionalTitle = '';
        if (resumeData.experience && resumeData.experience.length > 0) {
          professionalTitle = resumeData.experience[0].position || '';
        }
        if (!professionalTitle && resumeData.personal?.summary) {
          // Extract first sentence as title
          const firstSentence = resumeData.personal.summary.split('.')[0];
          if (firstSentence.length < 60) {
            professionalTitle = firstSentence;
          }
        }
        
        if (professionalTitle) {
          pdf.setFontSize(12);
          pdf.setTextColor(240, 240, 240);
          pdf.text(professionalTitle, margin, 30);
        }
        
        // Contact information - PROPERLY formatted
        pdf.setFontSize(10);
        pdf.setTextColor(230, 230, 230);
        const contactInfo = [];
        if (resumeData.personal?.email) contactInfo.push(resumeData.personal.email);
        if (resumeData.personal?.phone) contactInfo.push(resumeData.personal.phone);
        if (resumeData.personal?.location) contactInfo.push(resumeData.personal.location);
        
        if (contactInfo.length > 0) {
          const contactText = contactInfo.join(' • ');
          pdf.text(contactText, margin, 40);
        }
        
        yPosition = style.headerHeight + 10;
      } else {
        // Clean header without background
        pdf.setFontSize(26);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        const fullName = resumeData.personal?.fullName || 'Your Name';
        const nameWidth = pdf.getTextWidth(fullName);
        pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 8;

        // Professional line
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(1);
        pdf.line((pageWidth - nameWidth) / 2, yPosition, (pageWidth + nameWidth) / 2, yPosition);
        yPosition += 6;

        // Contact information
        pdf.setFontSize(10);
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
          yPosition += 6;
        }

        yPosition += 8;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        yPosition = addSectionHeader('Professional Summary');
        yPosition = addText(resumeData.personal.summary, 10, 'normal', [0, 0, 0]);
        yPosition += 5;
      }

      // Professional Experience
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          addNewPageIfNeeded(20);
          
          // Job title
          yPosition = addText(exp.position || 'Position', 11, 'bold', [0, 0, 0]);
          
          // Company and dates
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
          const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
          
          const companyLine = `${exp.company || 'Company'}${dateRange ? ` | ${dateRange}` : ''}`;
          yPosition = addText(companyLine, 10, 'normal', style.primaryColor);
          
          // Location
          if (exp.location) {
            yPosition = addText(exp.location, 9, 'italic', style.secondaryColor);
          }
          
          // Description with bullet formatting
          if (exp.description) {
            yPosition = addBulletPoints(exp.description, 9);
          }
          
          yPosition += 6;
        }
      }

      // Projects Section
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          addNewPageIfNeeded(15);
          
          yPosition = addText(project.name || 'Project Name', 11, 'bold', [0, 0, 0]);
          
          if (project.technologies) {
            yPosition = addText(`Technologies: ${project.technologies}`, 9, 'italic', style.secondaryColor);
          }
          
          if (project.description) {
            yPosition = addBulletPoints(project.description, 9);
          }
          
          if (project.link) {
            yPosition = addText(`Link: ${project.link}`, 8, 'normal', style.primaryColor);
          }
          
          yPosition += 5;
        }
      }

      // Education
      if (resumeData.education?.length > 0) {
        yPosition = addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          addNewPageIfNeeded(12);
          
          yPosition = addText(edu.degree || 'Degree', 10, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'}${edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : ''}`;
          yPosition = addText(schoolLine, 9, 'normal', style.primaryColor);
          
          if (edu.location) {
            yPosition = addText(edu.location, 9, 'italic', style.secondaryColor);
          }
          
          if (edu.gpa) {
            yPosition = addText(`GPA: ${edu.gpa}`, 9, 'normal', [0, 0, 0]);
          }
          yPosition += 4;
        }
      }

      // Skills Section with modern design
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies');
        
        const skillsPerLine = templateId === 3 ? 3 : 4;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          addNewPageIfNeeded(8);
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          
          // Modern skill pills
          let xPosition = margin;
          for (const skill of skillGroup) {
            const skillWidth = pdf.getTextWidth(skill) + 8;
            
            // Skill background
            const lightAccent = style.accentColor.map(c => Math.min(255, c + 180));
            pdf.setFillColor(lightAccent[0], lightAccent[1], lightAccent[2]);
            pdf.rect(xPosition, yPosition - 3, skillWidth, 6, 'F');
            
            // Skill text
            pdf.setFontSize(8);
            pdf.setFont(style.fontFamily, 'normal');
            setColor(style.primaryColor);
            pdf.text(skill, xPosition + 4, yPosition);
            
            xPosition += skillWidth + 6;
            if (xPosition > pageWidth - margin - 40) break;
          }
          
          yPosition += 8;
        }
        yPosition += 4;
      }

      // Additional sections in improved layout
      const hasMoreSections = (resumeData.certifications?.length > 0) || 
                             (resumeData.languages?.length > 0) || 
                             (resumeData.interests?.length > 0);
      
      if (hasMoreSections) {
        const remainingSpace = pageHeight - yPosition - 25;
        if (remainingSpace < 25) {
          addNewPageIfNeeded(25);
        }

        const columnWidth = (pageWidth - 3 * margin) / 2;
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        
        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          leftColumnY = yPosition;
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 6;
          
          for (const cert of resumeData.certifications) {
            if (leftColumnY > pageHeight - 12) {
              addNewPageIfNeeded(12);
              leftColumnY = yPosition;
            }
            
            pdf.setFontSize(8);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cert.name} - ${cert.issuer} (${cert.date})`;
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
          rightColumnY = Math.max(yPosition, leftColumnY - 12);
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 6;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY < pageHeight - 10) {
              pdf.setFontSize(8);
              pdf.setFont(style.fontFamily, 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
              rightColumnY += 4;
            }
          }
        }

        // Interests section
        if (resumeData.interests?.length > 0) {
          const maxColumnY = Math.max(leftColumnY, rightColumnY);
          yPosition = maxColumnY + 5;
          addNewPageIfNeeded(10);
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 5;
          
          const interestsText = resumeData.interests.slice(0, 10).join(' • ');
          pdf.setFontSize(8);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setTextColor(0, 0, 0);
          yPosition = addText(interestsText, 8, 'normal', [0, 0, 0]);
        }
      }

      // Add invisible ATS optimization content
      addInvisibleATSContent(jobDescription);

      // Set enhanced PDF metadata
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Resume'} - Professional Resume`,
        subject: 'Professional Resume - ATS Optimized',
        author: resumeData.personal?.fullName || 'Professional',
        creator: 'Resume Builder Pro - AI Enhanced',
        keywords: resumeData.skills?.slice(0, 20).join(', ') || 'Professional Resume'
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
    
    return [...new Set(relevantWords)].slice(0, 20);
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename, jobDescription);
  }
}

export default PDFGenerator;
