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

      // Template-specific styling and colors
      const getTemplateStyle = (templateId: number) => {
        const styles = {
          0: { // Modern Professional
            primaryColor: [37, 99, 235],
            secondaryColor: [107, 114, 128],
            headerBg: false,
            fontFamily: 'helvetica'
          },
          1: { // Executive
            primaryColor: [55, 65, 81],
            secondaryColor: [107, 114, 128],
            headerBg: false,
            fontFamily: 'helvetica'
          },
          2: { // Creative
            primaryColor: [147, 51, 234],
            secondaryColor: [236, 72, 153],
            headerBg: true,
            fontFamily: 'helvetica'
          },
          3: { // Tech
            primaryColor: [34, 197, 94],
            secondaryColor: [55, 65, 81],
            headerBg: true,
            fontFamily: 'courier'
          },
          4: { // Minimalist
            primaryColor: [75, 85, 99],
            secondaryColor: [156, 163, 175],
            headerBg: false,
            fontFamily: 'helvetica'
          },
          5: { // Corporate Classic
            primaryColor: [31, 41, 55],
            secondaryColor: [107, 114, 128],
            headerBg: false,
            fontFamily: 'times'
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
        addNewPageIfNeeded(16);
        
        pdf.setFontSize(12);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        pdf.text(title.toUpperCase(), margin, yPosition);
        
        pdf.setDrawColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 8; // Increased spacing after headers
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
          addNewPageIfNeeded(fontSize * 0.6);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.5; // Increased line spacing
        }
        
        return yPosition + 3; // Increased spacing after text blocks
      };

      const addBulletPoints = (text: string, fontSize = 9) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        
        // Split by periods, line breaks, and common sentence endings to create individual bullet points
        const sentences = cleanText
          .split(/[.\n]/)
          .map(sentence => sentence.trim())
          .filter(sentence => sentence && sentence.length > 10);
        
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          if (sentence) {
            addNewPageIfNeeded(fontSize + 3);
            
            pdf.setFontSize(fontSize);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            // Add bullet point
            pdf.text('•', margin + 5, yPosition);
            
            // Clean the sentence and ensure it doesn't already have a bullet
            const cleanedSentence = sentence.replace(/^[•·‣▪▫-]\s*/, '').trim();
            
            // Add bullet text with proper wrapping
            const maxWidth = pageWidth - 2 * margin - 15;
            const wrappedLines = pdf.splitTextToSize(cleanedSentence, maxWidth);
            
            for (let j = 0; j < wrappedLines.length; j++) {
              if (j > 0) {
                addNewPageIfNeeded(fontSize * 0.5);
                yPosition += fontSize * 0.5;
              }
              pdf.text(wrappedLines[j], margin + 15, yPosition);
            }
            
            // Move to next bullet point with better spacing
            yPosition += fontSize * 0.7; // Increased spacing between bullets
          }
        }
        
        return yPosition + 2; // Added spacing after bullet section
      };

      // Add hidden job description for ATS (invisible text)
      const addHiddenJobDescription = (jobDesc?: string) => {
        if (jobDesc && jobDesc.trim().length > 20) {
          pdf.setTextColor(255, 255, 255); // White text (invisible)
          pdf.setFontSize(1); // Tiny font
          const hiddenText = `ATS_KEYWORDS: ${cleanAndFormatText(jobDesc)}`;
          
          // Split into smaller chunks to avoid PDF rendering issues
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

      // Template-specific header rendering
      if (templateId === 2 || templateId === 3) {
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.rect(0, 0, pageWidth, 35, 'F'); // Increased header height
        
        pdf.setFontSize(20);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(resumeData.personal?.fullName || 'Your Name', margin, 20);
        
        pdf.setFontSize(10);
        pdf.setTextColor(240, 240, 240);
        const contactInfo = [
          resumeData.personal?.email,
          resumeData.personal?.phone,
          resumeData.personal?.location
        ].filter(Boolean).join(' • ');
        pdf.text(contactInfo, margin, 30);
        
        yPosition = 40; // More space after header
      } else {
        pdf.setFontSize(22);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        const nameWidth = pdf.getTextWidth(resumeData.personal?.fullName || 'Your Name');
        pdf.text(resumeData.personal?.fullName || 'Your Name', (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 6; // More spacing

        pdf.setFontSize(10);
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
          yPosition += 6; // More spacing
        }

        pdf.setDrawColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8; // More space after line
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        yPosition = addSectionHeader('Professional Summary');
        yPosition = addText(resumeData.personal.summary, 10, 'normal', [0, 0, 0]);
        yPosition += 4; // More spacing between sections
      }

      // Professional Experience - Enhanced with better spacing
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          addNewPageIfNeeded(20);
          
          // Job title
          yPosition = addText(exp.position || 'Position', 11, 'bold', [0, 0, 0]);
          
          // Company and dates with improved formatting
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
          const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
          
          const companyLine = `${exp.company || 'Company'}${dateRange ? ` | ${dateRange}` : ''}`;
          yPosition = addText(companyLine, 10, 'normal', style.primaryColor);
          
          // Location if available
          if (exp.location) {
            yPosition = addText(exp.location, 9, 'italic', style.secondaryColor);
          }
          
          // Description with improved bullet point handling
          if (exp.description) {
            yPosition = addBulletPoints(exp.description, 9);
          }
          
          yPosition += 4; // More spacing between experiences
        }
      }

      // Projects Section
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          addNewPageIfNeeded(12);
          
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
          
          yPosition += 2;
        }
      }

      // Education
      if (resumeData.education?.length > 0) {
        yPosition = addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          addNewPageIfNeeded(10);
          
          yPosition = addText(edu.degree || 'Degree', 10, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'}${edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : ''}`;
          yPosition = addText(schoolLine, 9, 'normal', style.primaryColor);
          
          if (edu.location) {
            yPosition = addText(edu.location, 9, 'italic', style.secondaryColor);
          }
          
          if (edu.gpa) {
            yPosition = addText(`GPA: ${edu.gpa}`, 9, 'normal', [0, 0, 0]);
          }
          yPosition += 1;
        }
      }

      // Skills Section
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies');
        
        const skillsPerLine = templateId === 3 ? 4 : 6;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          addNewPageIfNeeded(5);
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          const skillText = templateId === 3 ? 
            skillGroup.map((skill: string) => `• ${skill}`).join('  ') : 
            skillGroup.join(' • ');
          
          yPosition = addText(skillText, 9, 'normal', [0, 0, 0]);
        }
        yPosition += 2;
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
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 4;
          
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
              leftColumnY += 3;
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
          rightColumnY += 4;
          
          for (const lang of resumeData.languages) {
            if (rightColumnY < pageHeight - 8) {
              pdf.setFontSize(8);
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
          yPosition = maxColumnY + 2;
          addNewPageIfNeeded(10);
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 3;
          
          const interestsText = resumeData.interests.slice(0, 10).join(' • ');
          pdf.setFontSize(8);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setTextColor(0, 0, 0);
          yPosition = addText(interestsText, 8, 'normal', [0, 0, 0]);
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