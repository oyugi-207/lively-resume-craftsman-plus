
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Clean text helper - remove problematic characters
      const cleanText = (text: string): string => {
        if (!text) return '';
        return text
          .replace(/[^\x20-\x7E\xA0-\xFF]/g, '') // Remove non-printable characters
          .replace(/[•·‣▪▫▸▶●]/g, '-') // Replace bullets with simple dash
          .trim();
      };

      // Simple color scheme
      const colors = {
        primary: [41, 128, 185], // Professional blue
        secondary: [52, 73, 94], // Dark gray
        accent: [39, 174, 96], // Green
        text: [44, 62, 80] // Dark blue-gray
      };

      // Page break helper
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Header section
      if (resumeData.personal?.fullName) {
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text(cleanText(resumeData.personal.fullName), margin, yPosition);
        yPosition += 10;

        // Contact info
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        
        const contactInfo = [];
        if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
        if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
        if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));
        
        if (contactInfo.length > 0) {
          pdf.text(contactInfo.join(' | '), margin, yPosition);
          yPosition += 8;
        }

        // Simple line separator
        pdf.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }

      // Section header helper
      const addSectionHeader = (title: string) => {
        checkPageBreak(15);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 8;
      };

      // Text helper
      const addText = (text: string, fontSize = 10, fontStyle = 'normal', indent = 0, color = colors.text) => {
        if (!text) return;
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(color[0], color[1], color[2]);
        
        const maxWidth = pageWidth - 2 * margin - indent;
        const lines = pdf.splitTextToSize(cleanText(text), maxWidth);
        
        for (const line of lines) {
          checkPageBreak(fontSize * 0.6);
          pdf.text(line, margin + indent, yPosition);
          yPosition += fontSize * 0.6;
        }
        yPosition += 2;
      };

      // Simple bullet points
      const addBulletPoints = (text: string, indent = 8) => {
        if (!text) return;
        
        const bullets = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        for (const bullet of bullets) {
          checkPageBreak(8);
          
          let bulletText = bullet;
          if (!bulletText.startsWith('-')) {
            bulletText = `- ${bulletText.replace(/^[•·‣▪▫▸▶●-]*\s*/, '')}`;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          
          const maxWidth = pageWidth - 2 * margin - indent;
          const wrappedLines = pdf.splitTextToSize(cleanText(bulletText), maxWidth);
          
          for (const line of wrappedLines) {
            pdf.text(line, margin + indent, yPosition);
            yPosition += 5;
          }
          yPosition += 1;
        }
      };

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader('Professional Summary');
        addText(resumeData.personal.summary, 10, 'normal');
        yPosition += 5;
      }

      // Experience
      if (resumeData.experience?.length > 0) {
        addSectionHeader('Professional Experience');
        
        for (const exp of resumeData.experience) {
          checkPageBreak(25);
          
          // Job title
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text(cleanText(exp.position || 'Position'), margin, yPosition);
          yPosition += 5;
          
          // Company and dates
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          
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
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
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

      // Education
      if (resumeData.education?.length > 0) {
        addSectionHeader('Education');
        
        for (const edu of resumeData.education) {
          checkPageBreak(20);
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text(cleanText(edu.degree || 'Degree'), margin, yPosition);
          yPosition += 5;
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          
          const schoolInfo = cleanText(edu.school || 'School');
          const eduDate = edu.endDate ? ` | ${new Date(edu.endDate + '-01').getFullYear()}` : '';
          pdf.text(schoolInfo + eduDate, margin, yPosition);
          yPosition += 4;
          
          if (edu.location) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.text(cleanText(edu.location), margin, yPosition);
            yPosition += 4;
          }
          
          if (edu.gpa) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`GPA: ${cleanText(edu.gpa)}`, margin, yPosition);
            yPosition += 4;
          }
          
          if (edu.description) {
            yPosition += 2;
            addText(edu.description, 9, 'normal', 3);
          }
          
          yPosition += 6;
        }
      }

      // Skills - Simple list format
      if (resumeData.skills?.length > 0) {
        addSectionHeader('Core Competencies');
        
        const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
        const skillsArray = typeof skills[0] === 'object' 
          ? skills.map((skill: any) => skill.name || skill) 
          : skills;
        
        if (skillsArray.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          
          // Simple comma-separated list
          const skillsText = skillsArray
            .filter((skill: string) => skill && skill.trim())
            .map((skill: string) => cleanText(skill))
            .join(', ');
          
          const maxWidth = pageWidth - 2 * margin;
          const lines = pdf.splitTextToSize(skillsText, maxWidth);
          
          for (const line of lines) {
            checkPageBreak(6);
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          }
          yPosition += 8;
        }
      }

      // Projects
      if (resumeData.projects?.length > 0) {
        addSectionHeader('Key Projects');
        
        for (const project of resumeData.projects) {
          checkPageBreak(25);
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text(cleanText(project.name || 'Project'), margin, yPosition);
          yPosition += 5;
          
          if (project.startDate || project.endDate || project.technologies) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            
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
              pdf.text(projectDetails.join(' | '), margin, yPosition);
              yPosition += 4;
            }
          }
          
          if (project.description) {
            yPosition += 2;
            addBulletPoints(project.description, 5);
          }
          
          if (project.link) {
            pdf.setFontSize(9);
            pdf.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            pdf.text(`Link: ${cleanText(project.link)}`, margin, yPosition);
            yPosition += 6;
          } else {
            yPosition += 4;
          }
        }
      }

      // Additional sections in simple format
      if (resumeData.certifications?.length > 0) {
        addSectionHeader('Certifications');
        
        for (const cert of resumeData.certifications) {
          checkPageBreak(8);
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          pdf.text(`- ${cleanText(cert.name)} - ${cleanText(cert.issuer)} (${cleanText(cert.date)})`, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 5;
      }

      if (resumeData.languages?.length > 0) {
        addSectionHeader('Languages');
        
        const languagesList = resumeData.languages
          .map((lang: any) => `${cleanText(lang.language)} (${cleanText(lang.proficiency)})`)
          .join(', ');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        
        const maxWidth = pageWidth - 2 * margin;
        const lines = pdf.splitTextToSize(languagesList, maxWidth);
        
        for (const line of lines) {
          checkPageBreak(6);
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        }
        yPosition += 8;
      }

      if (resumeData.interests?.length > 0) {
        addSectionHeader('Interests');
        
        const interestsText = resumeData.interests
          .filter((interest: string) => interest && interest.trim())
          .map((interest: string) => cleanText(interest))
          .join(', ');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        
        const maxWidth = pageWidth - 2 * margin;
        const lines = pdf.splitTextToSize(interestsText, maxWidth);
        
        for (const line of lines) {
          checkPageBreak(6);
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        }
      }

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
