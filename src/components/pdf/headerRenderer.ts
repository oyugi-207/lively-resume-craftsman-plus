
import { PDFContext, ResumeData } from './types';
import { cleanText } from './pdfHelpers';

export const renderHeader = (context: PDFContext, resumeData: ResumeData): void => {
  if (!resumeData.personal?.fullName) return;

  switch (context.config.headerStyle) {
    case 'executive':
      renderExecutiveHeader(context, resumeData);
      break;
    case 'creative':
      renderCreativeHeader(context, resumeData);
      break;
    case 'tech':
      renderTechHeader(context, resumeData);
      break;
    case 'classic':
      renderClassicHeader(context, resumeData);
      break;
    default:
      renderModernHeader(context, resumeData);
  }

  // Enhanced contact info with better spacing
  context.pdf.setFontSize(10);
  context.pdf.setFont('helvetica', 'normal');
  context.pdf.setTextColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
  
  const contactInfo = [];
  if (resumeData.personal.email) contactInfo.push(cleanText(resumeData.personal.email));
  if (resumeData.personal.phone) contactInfo.push(cleanText(resumeData.personal.phone));
  if (resumeData.personal.location) contactInfo.push(cleanText(resumeData.personal.location));

  if (contactInfo.length > 0) {
    const contactText = contactInfo.join(' | ');
    const contactWidth = context.pdf.getTextWidth(contactText);
    context.pdf.text(contactText, (context.pageWidth - contactWidth) / 2, context.yPosition);
    context.yPosition += 6;
  }

  // Enhanced separator based on template
  if (context.config.headerStyle !== 'creative') {
    context.pdf.setDrawColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
    context.pdf.setLineWidth(context.config.headerStyle === 'executive' ? 1.0 : 0.5);
    context.pdf.line(context.margin, context.yPosition, context.pageWidth - context.margin, context.yPosition);
    context.yPosition += 12;
  } else {
    context.yPosition += 8;
  }
};

const renderExecutiveHeader = (context: PDFContext, resumeData: ResumeData): void => {
  context.pdf.setFontSize(26);
  context.pdf.setFont('helvetica', 'bold');
  context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
  const nameWidth = context.pdf.getTextWidth(cleanText(resumeData.personal.fullName));
  context.pdf.text(cleanText(resumeData.personal.fullName), (context.pageWidth - nameWidth) / 2, context.yPosition);
  context.yPosition += 12;
};

const renderCreativeHeader = (context: PDFContext, resumeData: ResumeData): void => {
  // Enhanced creative header with gradient effect simulation
  context.pdf.setFillColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
  context.pdf.rect(0, 0, context.pageWidth, 30, 'F');
  
  context.pdf.setFontSize(24);
  context.pdf.setFont('helvetica', 'bold');
  context.pdf.setTextColor(255, 255, 255);
  const nameWidth = context.pdf.getTextWidth(cleanText(resumeData.personal.fullName));
  context.pdf.text(cleanText(resumeData.personal.fullName), (context.pageWidth - nameWidth) / 2, 18);
  context.yPosition = 35;
};

const renderTechHeader = (context: PDFContext, resumeData: ResumeData): void => {
  context.pdf.setFontSize(24);
  context.pdf.setFont('helvetica', 'bold');
  context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
  context.pdf.text(cleanText(resumeData.personal.fullName), context.margin, context.yPosition);
  context.yPosition += 8;
  
  // Enhanced tech separator with double line
  context.pdf.setDrawColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
  context.pdf.setLineWidth(2.5);
  context.pdf.line(context.margin, context.yPosition, context.pageWidth - context.margin, context.yPosition);
  context.yPosition += 10;
};

const renderClassicHeader = (context: PDFContext, resumeData: ResumeData): void => {
  context.pdf.setFontSize(24);
  context.pdf.setFont('helvetica', 'bold');
  context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
  const nameWidth = context.pdf.getTextWidth(cleanText(resumeData.personal.fullName));
  context.pdf.text(cleanText(resumeData.personal.fullName), (context.pageWidth - nameWidth) / 2, context.yPosition);
  context.yPosition += 10;
};

const renderModernHeader = (context: PDFContext, resumeData: ResumeData): void => {
  context.pdf.setFontSize(24);
  context.pdf.setFont('helvetica', 'bold');
  context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
  const nameWidth = context.pdf.getTextWidth(cleanText(resumeData.personal.fullName));
  context.pdf.text(cleanText(resumeData.personal.fullName), (context.pageWidth - nameWidth) / 2, context.yPosition);
  context.yPosition += 10;
};
