
import { PDFContext } from './types';

export const cleanText = (text: string): string => {
  return text?.replace(/[^\x20-\x7E]/g, '').trim() || '';
};

export const checkPageBreak = (context: PDFContext, requiredSpace: number): boolean => {
  if (context.yPosition + requiredSpace > context.pageHeight - 15) {
    context.pdf.addPage();
    context.yPosition = context.margin;
    return true;
  }
  return false;
};

export const addSectionHeader = (context: PDFContext, title: string): void => {
  checkPageBreak(context, 15);
  
  context.pdf.setFontSize(14);
  context.pdf.setFont('helvetica', 'bold');
  context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);

  const upperTitle = title.toUpperCase();
  const headerWidth = context.pdf.getTextWidth(upperTitle);
  
  // Center ALL headers
  context.pdf.text(upperTitle, (context.pageWidth - headerWidth) / 2, context.yPosition);
  context.yPosition += 6;

  // Enhanced underline styling
  if (context.config.headerStyle === 'creative') {
    context.pdf.setDrawColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
    context.pdf.setLineWidth(1.5);
    const lineStart = (context.pageWidth - headerWidth) / 2;
    context.pdf.line(lineStart, context.yPosition, lineStart + headerWidth, context.yPosition);
  } else if (context.config.headerStyle === 'executive') {
    context.pdf.setDrawColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
    context.pdf.setLineWidth(1.2);
    context.pdf.line(context.margin, context.yPosition, context.pageWidth - context.margin, context.yPosition);
  } else {
    context.pdf.setDrawColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
    context.pdf.setLineWidth(0.8);
    context.pdf.line(context.margin, context.yPosition, context.pageWidth - context.margin, context.yPosition);
  }
  
  context.yPosition += 10;
};

export const addText = (context: PDFContext, text: string, fontSize = 9, fontStyle = 'normal', indent = 0): void => {
  if (!text) return;

  context.pdf.setFontSize(fontSize);
  context.pdf.setFont('helvetica', fontStyle);
  context.pdf.setTextColor(0, 0, 0);

  const maxWidth = context.pageWidth - 2 * context.margin - indent;
  const lines = context.pdf.splitTextToSize(cleanText(text), maxWidth);

  for (const line of lines) {
    checkPageBreak(context, fontSize * 0.5);
    context.pdf.text(line, context.margin + indent, context.yPosition);
    context.yPosition += fontSize * 0.5;
  }
  context.yPosition += 3;
};

export const addBulletPoints = (context: PDFContext, text: string, indent = 10): void => {
  if (!text) return;

  const bullets = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (const bullet of bullets) {
    checkPageBreak(context, 12);
    let bulletText = bullet;
    
    // Enhanced bullet styling based on template
    const bulletSymbol = context.config.headerStyle === 'creative' ? '▸' : 
                        context.config.headerStyle === 'executive' ? '■' : '•';
    
    if (!bulletText.match(/^[•·‣▪▫▸■-]\s/)) {
      bulletText = `${bulletSymbol} ${bulletText.replace(/^[•·‣▪▫▸■-]*\s*/, '')}`;
    }

    context.pdf.setFontSize(9);
    context.pdf.setFont('helvetica', 'normal');
    context.pdf.setTextColor(0, 0, 0);

    const maxWidth = context.pageWidth - 2 * context.margin - indent;
    const wrappedLines = context.pdf.splitTextToSize(cleanText(bulletText), maxWidth);

    for (let i = 0; i < wrappedLines.length; i++) {
      if (i > 0) checkPageBreak(context, 8);
      context.pdf.text(wrappedLines[i], context.margin + indent, context.yPosition);
      context.yPosition += 4.5;
    }
    context.yPosition += 3;
  }
};
