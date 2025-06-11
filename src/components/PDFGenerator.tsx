
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
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
        return styles[templateId] || styles[0];
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
        
        // Handle various line break characters and clean up text
        return text
          .replace(/\r\n/g, '\n')  // Convert Windows line breaks
          .replace(/\r/g, '\n')    // Convert Mac line breaks
          .replace(/\u0008/g, '')  // Remove backspace characters
          .replace(/\s+/g, ' ')    // Normalize multiple spaces
          .replace(/\n\s*\n/g, '\n') // Remove empty lines
          .trim();
      };

      const addSectionHeader = (title: string) => {
        addNewPageIfNeeded(15);
        
        pdf.setFontSize(12);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        pdf.text(title.toUpperCase(), margin, yPosition);
        
        // Add underline for all templates
        pdf.setDrawColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
        
        yPosition += 8;
        return yPosition;
      };

      const addText = (text: string, fontSize = 10, fontWeight = 'normal', color = [0, 0, 0], indent = 0) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        addNewPageIfNeeded(fontSize + 5);
        
        pdf.setFontSize(fontSize);
        pdf.setFont(style.fontFamily, fontWeight);
        setColor(color);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText, maxWidth);
        
        lines.forEach((line: string) => {
          addNewPageIfNeeded(fontSize * 0.7);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.5;
        });
        
        return yPosition + 2;
      };

      const addBulletPoints = (text: string, fontSize = 9) => {
        if (!text) return yPosition;
        
        const cleanText = cleanAndFormatText(text);
        // Split by actual line breaks and bullet characters
        const bullets = cleanText.split(/\n|•/).filter(line => line.trim());
        
        bullets.forEach((bullet: string) => {
          const cleanBullet = bullet.trim();
          if (cleanBullet) {
            addNewPageIfNeeded(fontSize + 2);
            
            pdf.setFontSize(fontSize);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            
            // Add bullet point
            pdf.text('•', margin + 5, yPosition);
            
            // Add bullet text with proper wrapping
            const maxWidth = pageWidth - 2 * margin - 15;
            const lines = pdf.splitTextToSize(cleanBullet, maxWidth);
            
            lines.forEach((line: string, index: number) => {
              if (index > 0) addNewPageIfNeeded(fontSize * 0.7);
              pdf.text(line, margin + 15, yPosition);
              yPosition += fontSize * 0.6;
            });
            
            yPosition += 2; // Space between bullets
          }
        });
        
        return yPosition;
      };

      // Add hidden job description for ATS (invisible text)
      const addHiddenJobDescription = () => {
        if (resumeData.jobDescription) {
          pdf.setTextColor(255, 255, 255); // White text (invisible)
          pdf.setFontSize(1); // Tiny font
          const hiddenText = `JOB_DESCRIPTION_START: ${cleanAndFormatText(resumeData.jobDescription)} :JOB_DESCRIPTION_END`;
          pdf.text(hiddenText, margin, pageHeight - 5); // Near bottom of page
        }
      };

      // Template-specific header rendering
      if (templateId === 2 || templateId === 3) { // Creative/Tech templates with colored header
        // Colored header background
        pdf.setFillColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.rect(0, 0, pageWidth, 35, 'F');
        
        // Name in white
        pdf.setFontSize(20);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(resumeData.personal?.fullName || 'Your Name', margin, 20);
        
        // Contact info in light color
        pdf.setFontSize(10);
        pdf.setTextColor(240, 240, 240);
        const contactInfo = [
          resumeData.personal?.email,
          resumeData.personal?.phone,
          resumeData.personal?.location
        ].filter(Boolean).join(' • ');
        pdf.text(contactInfo, margin, 28);
        
        yPosition = 45;
      } else {
        // Standard header for other templates
        pdf.setFontSize(22);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        const nameWidth = pdf.getTextWidth(resumeData.personal?.fullName || 'Your Name');
        pdf.text(resumeData.personal?.fullName || 'Your Name', (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 8;

        // Contact information
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
          yPosition += 10;
        }

        // Separator line
        pdf.setDrawColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.setLineWidth(0.8);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }

      // Professional Summary
      if (resumeData.personal?.summary) {
        yPosition = addSectionHeader('Professional Summary');
        yPosition = addText(resumeData.personal.summary, 10, 'normal', [0, 0, 0]);
        yPosition += 5;
      }

      // Professional Experience - Enhanced with better formatting
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience');
        
        resumeData.experience.forEach((exp: any) => {
          addNewPageIfNeeded(25);
          
          // Job title
          yPosition = addText(exp.position || 'Position', 11, 'bold', [0, 0, 0]);
          
          // Company and dates
          const companyLine = `${exp.company || 'Company'} | ${exp.startDate || ''} - ${exp.endDate || ''}`;
          yPosition = addText(companyLine, 10, 'normal', style.primaryColor);
          
          // Location if available
          if (exp.location) {
            yPosition = addText(exp.location, 9, 'italic', style.secondaryColor);
          }
          
          // Description with improved bullet point handling
          if (exp.description) {
            yPosition = addBulletPoints(exp.description, 9);
          }
          
          // Add hidden job description context for ATS
          if (resumeData.jobDescription && exp.description) {
            const relevantKeywords = PDFGenerator.extractRelevantKeywords(resumeData.jobDescription, exp.description);
            if (relevantKeywords.length > 0) {
              pdf.setTextColor(255, 255, 255); // Hidden white text
              pdf.setFontSize(1);
              pdf.text(`KEYWORDS: ${relevantKeywords.join(' ')}`, margin, yPosition);
              pdf.setTextColor(0, 0, 0); // Reset to black
            }
          }
          
          yPosition += 5;
        });
      }

      // Projects Section - Enhanced
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects');
        
        resumeData.projects.forEach((project: any) => {
          addNewPageIfNeeded(20);
          
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
          
          yPosition += 4;
        });
      }

      // Education - Enhanced
      if (resumeData.education?.length > 0) {
        yPosition = addSectionHeader('Education');
        
        resumeData.education.forEach((edu: any) => {
          addNewPageIfNeeded(15);
          
          yPosition = addText(edu.degree || 'Degree', 10, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'} | ${edu.endDate || ''}`;
          yPosition = addText(schoolLine, 9, 'normal', style.primaryColor);
          
          if (edu.location) {
            yPosition = addText(edu.location, 9, 'italic', style.secondaryColor);
          }
          
          if (edu.gpa) {
            yPosition = addText(`GPA: ${edu.gpa}`, 9, 'normal', [0, 0, 0]);
          }
          yPosition += 3;
        });
      }

      // Skills Section - Enhanced
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies');
        
        // Group skills into lines for better presentation
        const skillsPerLine = templateId === 3 ? 4 : 6;
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          addNewPageIfNeeded(8);
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          const skillText = templateId === 3 ? 
            skillGroup.map((skill: string) => `• ${skill}`).join('  ') : 
            skillGroup.join(' • ');
          
          yPosition = addText(skillText, 9, 'normal', [0, 0, 0]);
        }
        yPosition += 5;
      }

      // Check if we need more space for remaining sections
      const remainingSpace = pageHeight - yPosition - 20;
      const hasMoreSections = (resumeData.certifications?.length > 0) || 
                             (resumeData.languages?.length > 0) || 
                             (resumeData.interests?.length > 0);
      
      if (hasMoreSections && remainingSpace < 30) {
        addNewPageIfNeeded(30);
      }

      // Remaining sections in compact format
      if (hasMoreSections) {
        // Two-column layout for remaining sections
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
          
          resumeData.certifications.forEach((cert: any) => {
            if (leftColumnY > pageHeight - 15) {
              addNewPageIfNeeded(15);
              leftColumnY = yPosition;
            }
            
            pdf.setFontSize(8);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cert.name} - ${cert.issuer} (${cert.date})`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            lines.forEach((line: string) => {
              pdf.text(line, margin, leftColumnY);
              leftColumnY += 4;
            });
          });
        }

        // Right column - Languages
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          rightColumnY = Math.max(yPosition, leftColumnY - 20);
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 6;
          
          resumeData.languages.forEach((lang: any) => {
            if (rightColumnY < pageHeight - 10) {
              pdf.setFontSize(8);
              pdf.setFont(style.fontFamily, 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
              rightColumnY += 4;
            }
          });
        }

        // Interests section
        if (resumeData.interests?.length > 0) {
          const maxColumnY = Math.max(leftColumnY, rightColumnY);
          yPosition = maxColumnY + 5;
          addNewPageIfNeeded(15);
          
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 4;
          
          const interestsText = resumeData.interests.slice(0, 10).join(' • ');
          pdf.setFontSize(8);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setTextColor(0, 0, 0);
          yPosition = addText(interestsText, 8, 'normal', [0, 0, 0]);
        }
      }

      // Add hidden job description for ATS optimization only if there's content
      if (resumeData.jobDescription) {
        // Only add if we're on the first page and have space
        if (currentPage === 1 && yPosition < pageHeight - 20) {
          addHiddenJobDescription();
        } else {
          // Add on a new page only if we have significant content
          const contentLength = resumeData.jobDescription.length;
          if (contentLength > 100) { // Only add extra page if job description is substantial
            pdf.addPage();
            pdf.setTextColor(255, 255, 255); // White text
            pdf.setFontSize(1);
            const hiddenContent = `ATS_OPTIMIZATION_DATA: ${cleanAndFormatText(resumeData.jobDescription)}`;
            pdf.text(hiddenContent, margin, margin);
          }
        }
      }

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

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename);
  }
}

export default PDFGenerator;
