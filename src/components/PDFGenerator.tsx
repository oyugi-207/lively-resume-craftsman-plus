
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

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

      const addSectionHeader = (title: string, yPos: number) => {
        if (yPos > pageHeight - 20) return yPos;
        
        pdf.setFontSize(12);
        pdf.setFont(style.fontFamily, 'bold');
        setColor(style.primaryColor);
        pdf.text(title.toUpperCase(), margin, yPos);
        
        // Add underline for all templates
        pdf.setDrawColor(style.primaryColor[0], style.primaryColor[1], style.primaryColor[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
        
        return yPos + 8;
      };

      const addText = (text: string, yPos: number, fontSize = 10, fontWeight = 'normal', color = [0, 0, 0], indent = 0) => {
        if (yPos > pageHeight - 15) return yPos;
        
        pdf.setFontSize(fontSize);
        pdf.setFont(style.fontFamily, fontWeight);
        setColor(color);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPos < pageHeight - 10) {
            pdf.text(line, margin + indent, yPos);
            yPos += fontSize * 0.5;
          }
        });
        
        return yPos + 2;
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
        yPosition = addSectionHeader('Professional Summary', yPosition);
        yPosition = addText(resumeData.personal.summary, yPosition, 10, 'normal', [0, 0, 0]);
        yPosition += 5;
      }

      // Professional Experience
      if (resumeData.experience?.length > 0) {
        yPosition = addSectionHeader('Professional Experience', yPosition);
        
        resumeData.experience.slice(0, 3).forEach((exp: any) => {
          if (yPosition > pageHeight - 30) return;
          
          // Job title
          yPosition = addText(exp.position || 'Position', yPosition, 11, 'bold', [0, 0, 0]);
          
          // Company and dates
          const companyLine = `${exp.company || 'Company'} | ${exp.startDate || ''} - ${exp.endDate || ''}`;
          yPosition = addText(companyLine, yPosition, 10, 'normal', style.primaryColor);
          
          // Description with bullet points
          if (exp.description) {
            const bullets = exp.description.split('\n').filter((line: string) => line.trim());
            bullets.slice(0, 4).forEach((bullet: string) => {
              const cleanBullet = bullet.startsWith('•') ? bullet : `• ${bullet}`;
              yPosition = addText(cleanBullet, yPosition, 9, 'normal', [0, 0, 0], 5);
            });
          }
          yPosition += 3;
        });
      }

      // Projects Section
      if (resumeData.projects?.length > 0) {
        yPosition = addSectionHeader('Key Projects', yPosition);
        
        resumeData.projects.slice(0, 3).forEach((project: any) => {
          if (yPosition > pageHeight - 25) return;
          
          yPosition = addText(project.name || 'Project Name', yPosition, 11, 'bold', [0, 0, 0]);
          
          if (project.technologies) {
            yPosition = addText(`Technologies: ${project.technologies}`, yPosition, 9, 'italic', style.secondaryColor);
          }
          
          if (project.description) {
            yPosition = addText(project.description, yPosition, 9, 'normal', [0, 0, 0], 5);
          }
          
          if (project.link) {
            yPosition = addText(`Link: ${project.link}`, yPosition, 8, 'normal', style.primaryColor, 5);
          }
          
          yPosition += 3;
        });
      }

      // Education
      if (resumeData.education?.length > 0) {
        yPosition = addSectionHeader('Education', yPosition);
        
        resumeData.education.slice(0, 2).forEach((edu: any) => {
          if (yPosition > pageHeight - 20) return;
          
          yPosition = addText(edu.degree || 'Degree', yPosition, 10, 'bold', [0, 0, 0]);
          const schoolLine = `${edu.school || 'School'} | ${edu.endDate || ''}`;
          yPosition = addText(schoolLine, yPosition, 9, 'normal', style.primaryColor);
          
          if (edu.gpa) {
            yPosition = addText(`GPA: ${edu.gpa}`, yPosition, 9, 'normal', [0, 0, 0], 5);
          }
          yPosition += 2;
        });
      }

      // Skills Section
      if (resumeData.skills?.length > 0) {
        yPosition = addSectionHeader('Core Competencies', yPosition);
        
        // Group skills into lines for better presentation
        const skillsPerLine = templateId === 3 ? 4 : 6; // Tech template uses fewer per line
        for (let i = 0; i < resumeData.skills.length; i += skillsPerLine) {
          if (yPosition > pageHeight - 15) break;
          
          const skillGroup = resumeData.skills.slice(i, i + skillsPerLine);
          const skillText = templateId === 3 ? 
            skillGroup.map(skill => `• ${skill}`).join('  ') : 
            skillGroup.join(' • ');
          
          yPosition = addText(skillText, yPosition, 9, 'normal', [0, 0, 0]);
        }
        yPosition += 5;
      }

      // Remaining sections in compact format if space allows
      const remainingSpace = pageHeight - yPosition - 20;
      
      if (remainingSpace > 25) {
        // Two-column layout for remaining sections
        const columnWidth = (pageWidth - 3 * margin) / 2;
        let leftColumnY = yPosition;
        let rightColumnY = yPosition;
        
        // Left column - Certifications
        if (resumeData.certifications?.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('CERTIFICATIONS', margin, leftColumnY);
          leftColumnY += 6;
          
          resumeData.certifications.slice(0, 3).forEach((cert: any) => {
            pdf.setFontSize(8);
            pdf.setFont(style.fontFamily, 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cert.name} - ${cert.issuer} (${cert.date})`;
            const lines = pdf.splitTextToSize(certText, columnWidth);
            lines.forEach((line: string) => {
              if (leftColumnY < pageHeight - 10) {
                pdf.text(line, margin, leftColumnY);
                leftColumnY += 4;
              }
            });
          });
        }

        // Right column - Languages
        if (resumeData.languages?.length > 0) {
          const rightColumnX = margin + columnWidth + margin;
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('LANGUAGES', rightColumnX, rightColumnY);
          rightColumnY += 6;
          
          resumeData.languages.slice(0, 5).forEach((lang: any) => {
            if (rightColumnY < pageHeight - 10) {
              pdf.setFontSize(8);
              pdf.setFont(style.fontFamily, 'normal');
              pdf.setTextColor(0, 0, 0);
              pdf.text(`• ${lang.language} (${lang.proficiency})`, rightColumnX, rightColumnY);
              rightColumnY += 4;
            }
          });
        }

        // Interests at the bottom if space
        const maxColumnY = Math.max(leftColumnY, rightColumnY);
        if (resumeData.interests?.length > 0 && maxColumnY < pageHeight - 15) {
          yPosition = maxColumnY + 5;
          pdf.setFontSize(10);
          pdf.setFont(style.fontFamily, 'bold');
          setColor(style.primaryColor);
          pdf.text('INTERESTS', margin, yPosition);
          yPosition += 4;
          
          const interestsText = resumeData.interests.slice(0, 8).join(' • ');
          pdf.setFontSize(8);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setTextColor(0, 0, 0);
          pdf.text(interestsText, margin, yPosition);
        }
      }

      // Set clean PDF metadata
      pdf.setProperties({
        title: `${resumeData.personal?.fullName || 'Resume'} - Resume`,
        subject: 'Professional Resume',
        author: resumeData.personal?.fullName || 'Professional',
        creator: 'Resume Builder Pro',
        keywords: resumeData.skills?.slice(0, 10).join(', ') || 'Professional Resume'
      });

      // Save the PDF with template-specific styling preserved
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAdvancedPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf'): Promise<void> {
    return this.generateTextPDF(resumeData, templateId, filename);
  }
}

export default PDFGenerator;
