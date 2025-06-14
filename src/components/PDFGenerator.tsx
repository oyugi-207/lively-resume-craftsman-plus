import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;
      let currentPage = 1;

      // Enhanced template-specific styling and colors for modern design
      const getTemplateStyle = (templateId: number) => {
        const styles = {
          0: { // Modern Professional - Enhanced
            primaryColor: [59, 130, 246], // Modern blue
            secondaryColor: [71, 85, 105],
            accentColor: [16, 185, 129], // Green accent
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
            headerHeight: 45
          },
          3: { // Tech
            primaryColor: [34, 197, 94],
            secondaryColor: [55, 65, 81],
            accentColor: [59, 130, 246],
            headerBg: true,
            fontFamily: 'courier',
            headerHeight: 42
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
          currentPage++;
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
        addNewPageIfNeeded(10);
        
        // Modern section header with enhanced styling
        pdf.setFontSize(11);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        
        // Add a subtle background rectangle for modern look (using lighter opacity alternative)
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        // Create a very light version of the color instead of using setGlobalAlpha
        const lightColor = style.primaryColor.map(c => Math.min(255, c + 200));
        pdf.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        pdf.rect(margin - 2, yPosition - 3, pageWidth - 2 * margin + 4, 7, 'F');
        
        pdf.text(title.toUpperCase(), margin, yPosition);
        
        // Modern underline with gradient effect
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 1, pageWidth - margin, yPosition + 1);
        
        yPosition += 8;
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
          yPosition += fontSize * 0.35; // Tighter line spacing
        }
        
        return yPosition + 1; // Minimal spacing after text blocks
      };

      const addBulletPoints = (text: string, fontSize = 9) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        
        // Enhanced bullet point parsing - split by various delimiters
        const sentences = cleanText
          .split(/[.\n•·‣▪▫-]/)
          .map(sentence => sentence.trim())
          .filter(sentence => sentence && sentence.length > 8);
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          if (sentence) {
            addNewPageIfNeeded(fontSize + 1);
            
            pdf.setFontSize(fontSize);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            // Modern bullet point design with simple circle
            pdf.setFillColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
            pdf.circle(margin + 6, yPosition - 1, 0.7, 'F'); // Small filled circle
            
            // Clean the sentence and ensure proper formatting
            const cleanedSentence = sentence.replace(/^[•·‣▪▫-]\s*/, '').trim();
            
            // Add bullet text with proper wrapping and consistent spacing
            const maxWidth = pageWidth - 2 * margin - 10;
            const wrappedLines = pdf.splitTextToSize(cleanedSentence, maxWidth);
            
            let lineY = yPosition;
            for (let j = 0; j < wrappedLines.length; j++) {
              if (j > 0) {
                addNewPageIfNeeded(fontSize * 0.35);
                lineY += fontSize * 0.35;
              }
              pdf.text(wrappedLines[j], margin + 10, lineY);
            }
            
            // Tighter vertical spacing between bullet points
            yPosition = lineY + fontSize * 0.4;
          }
        }
        
        return yPosition + 1;
      };

      // Add hidden job description for ATS (invisible text)
      const addHiddenJobDescription = (jobDesc?: string) => {
        if (jobDesc && jobDesc.trim().length > 20) {
          pdf.setTextColor(255, 255, 255); // White text (invisible)
          pdf.setFontSize(1); // Tiny font
          const hiddenText = `ATS_KEYWORDS: ${cleanAndFormatText(jobDesc)}`;
          
          const chunks = hiddenText.match(/.{1,100}/g) || [hiddenText];
          let hiddenY = pageHeight - 10;
          
          for (const chunk of chunks) {
            if (hiddenY < pageHeight - 5) {
              pdf.text(chunk, margin, hiddenY);
              hiddenY += 2;
            }
          }
        }
      };

      // Enhanced modern header rendering
      if (style.headerBg) {
        // Solid header background instead of gradient
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.rect(0, 0, pageWidth, style.headerHeight, 'F');
        
        // Name with enhanced typography
        pdf.setFontSize(20);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(255, 255, 255);
        const nameText = resumeData.personal?.fullName || 'Your Name';
        pdf.text(nameText, margin, 18);
        
        // Professional subtitle/title
        if (resumeData.personal?.summary) {
          const titleLine = resumeData.personal.summary.split('.')[0].substring(0, 50) + '...';
          pdf.setFontSize(10);
          pdf.setTextColor(240, 240, 240);
          pdf.text(titleLine, margin, 26);
        }
        
        // Contact information with modern styling
        pdf.setFontSize(8);
        pdf.setTextColor(230, 230, 230);
        const contactInfo = [
          resumeData.personal?.email,
          resumeData.personal?.phone,
          resumeData.personal?.location
        ].filter(Boolean).join(' • ');
        if (contactInfo) {
          pdf.text(contactInfo, margin, 32);
        }
        
        yPosition = style.headerHeight + 6;
      } else {
        // Modern centered header without background
        pdf.setFontSize(22);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        const nameWidth = pdf.getTextWidth(resumeData.personal?.fullName || 'Your Name');
        pdf.text(resumeData.personal?.fullName || 'Your Name', (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 4;

        // Professional line under name
        pdf.setDrawColor(style.accentColor[0], style.accentColor[1], style.accentColor[2]);
        pdf.setLineWidth(0.8);
        pdf.line((pageWidth - nameWidth) / 2, yPosition, (pageWidth + nameWidth) / 2, yPosition);
        yPosition += 3;

        // Contact information
        pdf.setFontSize(9);
        pdf.setFont(style.fontFamily, 'normal');
        setColor(style.secondaryColor);
        const contactInfo = [
          resumeData.personal?.email,
          resumeData.personal?.phone,
          resumeData.personal?.location
        ].filter(Boolean).join(' • ');
        
        if (contactInfo) {
          const contactWidth = pdf.getTextWidth(contactInfo);
          pdf.text(contactInfo, (pageWidth - contactWidth) / 2, yPosition);
          yPosition += 4;
        }

        yPosition += 4;
      }

      // Professional Summary with enhanced formatting
      if (resumeData.personal?.summary) {
        yPosition = addSectionHeader('Professional Summary');
        yPosition = addText(resumeData.personal.summary, 9, 'normal', [0, 0, 0]);
        yPosition += 2;
      }

      // Professional Experience with improved layout
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          addNewPageIfNeeded(15);
          
          // Job title with enhanced styling
          yPosition = addText(exp.position || 'Position', 10, 'bold', [0, 0, 0]);
          
          // Company and dates with modern formatting
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
          const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
          
          const companyLine = `${exp.company || 'Company'}${dateRange ? ` | ${dateRange}` : ''}`;
          yPosition = addText(companyLine, 9, 'normal', style.primaryColor);
          
          // Location with modern styling
          if (exp.location) {
            yPosition = addText(exp.location, 8, 'italic', style.secondaryColor);
          }
          
          // Description with improved bullet formatting
          if (exp.description) {
            yPosition = addBulletPoints(exp.description, 8);
          }
          
          yPosition += 2;
        }
      }

      // Projects Section
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          addNewPageIfNeeded(10);
          
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
          
          yPosition += 1;
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
          yPosition += 1;
        }
      }

      // Skills Section with modern grid layout
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies');
        
        const skillsPerLine = templateId === 3 ? 4 : 5;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          addNewPageIfNeeded(4);
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          
          // Modern skill pills design
          let xPosition = margin;
          for (const skill of skillGroup) {
            const skillWidth = pdf.getTextWidth(skill) + 6;
            
            // Skill background with lighter color instead of alpha
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
          
          yPosition += 6;
        }
        yPosition += 1;
      }

      // Check if we need more space for remaining sections
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
          leftColumnY += 3;
          
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
              leftColumnY += 2.5;
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
          rightColumnY += 3;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY < pageHeight - 6) {
              pdf.setFontSize(7);
              pdf.setFont(style.fontFamily, 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
              rightColumnY += 2.5;
            }
          }
        }

        // Interests section
        if (resumeData.interests?.length > 0) {
          const maxColumnY = Math.max(leftColumnY, rightColumnY);
          yPosition = maxColumnY + 1;
          addNewPageIfNeeded(8);
          
          pdf.setFontSize(9);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 2;
          
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

  // Helper function to extract relevant keywords for ATS optimization
  static extractRelevantKeywords(jobDescription: string, experienceText: string): string[] {
    if (!jobDescription || !experienceText) return [];
    
    const jobWords = jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const expWords = experienceText.toLowerCase().match(/\b\w{3,}\b/g) || [];
    
    // Find common meaningful words (exclude common words)
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'will', 'can', 'has', 'have', 'had', 'this', 'that', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'all', 'any', 'some', 'more', 'most', 'other', 'such', 'than', 'very', 'just', 'only', 'also', 'even', 'well', 'back', 'still', 'way', 'new', 'old', 'good', 'great', 'first', 'last', 'long', 'own', 'over', 'think', 'time', 'work', 'life', 'day', 'year', 'may', 'come', 'its', 'now', 'people', 'take', 'get', 'use', 'her', 'him', 'his', 'she', 'see', 'go']);
    
    const relevantWords = jobWords.filter(word => 
      !commonWords.has(word) && 
      expWords.includes(word) && 
      word.length > 3
    );
    
    return [...new Set(relevantWords)].slice(0, 10);
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename, jobDescription);
  }
}

export default PDFGenerator;
