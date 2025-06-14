
import { PDFContext, ResumeData } from './types';
import { cleanText, checkPageBreak, addText, addBulletPoints } from './pdfHelpers';

export const renderEducationSection = (context: PDFContext, education: ResumeData['education']): void => {
  if (!education || education.length === 0) return;

  for (const edu of education) {
    checkPageBreak(context, 35);
    
    // Enhanced degree styling
    context.pdf.setFontSize(11);
    context.pdf.setFont('helvetica', 'bold');
    context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
    context.pdf.text(cleanText(edu.degree || 'Degree'), context.margin, context.yPosition);
    context.yPosition += 6;

    // School information with enhanced formatting
    context.pdf.setFontSize(10);
    context.pdf.setFont('helvetica', 'normal');
    context.pdf.setTextColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
    
    let schoolLine = cleanText(edu.school || 'School');
    if (edu.endDate) {
      const year = new Date(edu.endDate + '-01').getFullYear();
      schoolLine += ` | Class of ${year}`;
    }
    context.pdf.text(schoolLine, context.margin, context.yPosition);
    context.yPosition += 5;
    
    // Location with enhanced spacing
    if (edu.location) {
      context.pdf.setFontSize(9);
      context.pdf.setTextColor(100, 100, 100);
      context.pdf.text(cleanText(edu.location), context.margin, context.yPosition);
      context.yPosition += 5;
    }
    
    // Enhanced GPA display
    if (edu.gpa) {
      context.pdf.setFontSize(9);
      context.pdf.setFont('helvetica', 'italic');
      context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.text(`GPA: ${cleanText(edu.gpa)}`, context.margin, context.yPosition);
      context.yPosition += 5;
    }
    
    // Description with better formatting
    if (edu.description) {
      context.yPosition += 2;
      if (edu.description.includes('\n') || edu.description.includes('•')) {
        addBulletPoints(context, edu.description, 8);
      } else {
        addText(context, edu.description, 9, 'normal', 8);
      }
    }
    
    // Enhanced relevant coursework section
    if (edu.courses) {
      context.pdf.setFontSize(9);
      context.pdf.setFont('helvetica', 'bold');
      context.pdf.setTextColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
      context.pdf.text('Relevant Coursework:', context.margin, context.yPosition);
      context.yPosition += 4;
      
      context.pdf.setFont('helvetica', 'normal');
      context.pdf.setTextColor(0, 0, 0);
      addText(context, edu.courses, 8.5, 'normal', 8);
    }
    
    // Enhanced honors and awards section
    if (edu.honors) {
      context.pdf.setFontSize(9);
      context.pdf.setFont('helvetica', 'bold');
      context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.text('Honors & Awards:', context.margin, context.yPosition);
      context.yPosition += 4;
      
      context.pdf.setFont('helvetica', 'normal');
      context.pdf.setTextColor(0, 0, 0);
      if (edu.honors.includes('\n') || edu.honors.includes('•')) {
        addBulletPoints(context, edu.honors, 8);
      } else {
        addText(context, edu.honors, 8.5, 'normal', 8);
      }
    }

    context.yPosition += 8;
  }
};
