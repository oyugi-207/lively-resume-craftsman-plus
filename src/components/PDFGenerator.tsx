
import jsPDF from 'jspdf';
import { ResumeData, PDFContext } from './pdf/types';
import { templateConfigs } from './pdf/templateConfigs';
import { cleanText, checkPageBreak, addSectionHeader, addText, addBulletPoints } from './pdf/pdfHelpers';
import { renderHeader } from './pdf/headerRenderer';
import { renderSkillsSection } from './pdf/skillsRenderer';
import { renderEducationSection } from './pdf/educationRenderer';

export class PDFGenerator {
  static async generateTextPDF(resumeData: any, templateId: number = 0, filename: string = 'resume.pdf', jobDescription?: string): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;

      const config = templateConfigs[templateId] || templateConfigs[0];
      
      const context: PDFContext = {
        pdf,
        pageWidth,
        pageHeight,
        margin,
        yPosition: margin,
        config
      };

      // Render header
      renderHeader(context, resumeData);

      // Professional Summary
      if (resumeData.personal?.summary) {
        addSectionHeader(context, 'Professional Summary');
        addText(context, resumeData.personal.summary, 10, 'normal');
        context.yPosition += 6;
      }

      // Professional Experience
      if (resumeData.experience?.length > 0) {
        addSectionHeader(context, 'Professional Experience');
        for (const exp of resumeData.experience) {
          checkPageBreak(context, 30);
          
          // Enhanced position title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.text(cleanText(exp.position || 'Position'), margin, context.yPosition);
          context.yPosition += 6;

          // Company and date info
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
          
          let companyLine = cleanText(exp.company || 'Company');
          if (exp.startDate || exp.endDate) {
            const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
            const endDate = exp.endDate ? (exp.endDate.toLowerCase() === 'present' ? 'Present' : new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })) : 'Present';
            companyLine += ` | ${startDate} - ${endDate}`;
          }
          
          pdf.text(companyLine, margin, context.yPosition);
          context.yPosition += 5;

          if (exp.location) {
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            pdf.text(cleanText(exp.location), margin, context.yPosition);
            context.yPosition += 5;
          }

          if (exp.description) {
            context.yPosition += 2;
            addBulletPoints(context, exp.description, 8);
          }
          context.yPosition += 8;
        }
      }

      // Education - Enhanced
      if (resumeData.education?.length > 0) {
        addSectionHeader(context, 'Education');
        renderEducationSection(context, resumeData.education);
      }

      // Core Competencies (Skills) - Enhanced
      if (resumeData.skills?.length > 0) {
        addSectionHeader(context, 'Core Competencies');
        renderSkillsSection(context, resumeData.skills);
      }

      // Projects - Enhanced
      if (resumeData.projects?.length > 0) {
        addSectionHeader(context, 'Projects');
        for (const project of resumeData.projects) {
          checkPageBreak(context, 30);
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
          pdf.text(cleanText(project.name || 'Project'), margin, context.yPosition);
          context.yPosition += 6;
          
          // Enhanced project details
          if (project.startDate || project.endDate) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            const dateRange = `${project.startDate || ''} - ${project.endDate || 'Present'}`;
            pdf.text(dateRange, margin, context.yPosition);
            context.yPosition += 4;
          }
          
          if (project.technologies) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(config.secondaryColor[0], config.secondaryColor[1], config.secondaryColor[2]);
            pdf.text('Technologies:', margin, context.yPosition);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            const techWidth = pdf.getTextWidth('Technologies: ');
            pdf.text(cleanText(project.technologies), margin + techWidth, context.yPosition);
            context.yPosition += 5;
          }
          
          if (project.description) {
            context.yPosition += 1;
            addBulletPoints(context, project.description, 8);
          }
          
          if (project.link) {
            pdf.setFontSize(8);
            pdf.setTextColor(config.primaryColor[0], config.primaryColor[1], config.primaryColor[2]);
            pdf.text(cleanText(project.link), margin, context.yPosition);
            context.yPosition += 6;
          } else {
            context.yPosition += 4;
          }
        }
      }

      // Additional sections in enhanced two-column layout
      const hasAdditionalSections = (resumeData.certifications?.length > 0) ||
                                   (resumeData.languages?.length > 0) ||
                                   (resumeData.interests?.length > 0);

      if (hasAdditionalSections) {
        checkPageBreak(context, 40);
        
        // Certifications
        if (resumeData.certifications?.length > 0) {
          addSectionHeader(context, 'Certifications');
          for (const cert of resumeData.certifications) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            const certText = `• ${cleanText(cert.name)} - ${cleanText(cert.issuer)} (${cleanText(cert.date)})`;
            addText(context, certText, 9, 'normal');
          }
        }

        // Languages
        if (resumeData.languages?.length > 0) {
          addSectionHeader(context, 'Languages');
          for (const lang of resumeData.languages) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            addText(context, `• ${cleanText(lang.language)} (${cleanText(lang.proficiency)})`, 9, 'normal');
          }
        }

        // Interests
        if (resumeData.interests?.length > 0) {
          addSectionHeader(context, 'Interests');
          const interestsText = resumeData.interests
            .filter((interest: string) => interest && interest.trim())
            .map((interest: string) => cleanText(interest))
            .join(' • ');
          addText(context, interestsText, 9, 'normal');
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
