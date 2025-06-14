
import { PDFContext } from './types';
import { cleanText, checkPageBreak } from './pdfHelpers';

export const renderSkillsSection = (context: PDFContext, skills: string[]): void => {
  if (!skills || skills.length === 0) return;

  const filteredSkills = skills.filter((skill: string) => skill && skill.trim()).map((skill: string) => cleanText(skill));
  
  // Enhanced skills layout with better visual hierarchy
  const tagPaddingX = 3;
  const tagPaddingY = 1.5;
  const tagGap = 3;
  const fontSize = 9;
  let x = context.margin;
  context.yPosition += 3;
  
  for (let i = 0; i < filteredSkills.length; i++) {
    const skill = filteredSkills[i];
    context.pdf.setFontSize(fontSize);
    context.pdf.setFont('helvetica', 'bold');
    
    const skillW = context.pdf.getTextWidth(skill) + tagPaddingX * 2;
    
    // Wrap to new line if needed
    if (x + skillW > context.pageWidth - context.margin) {
      x = context.margin;
      context.yPosition += fontSize + tagPaddingY * 2 + tagGap;
      checkPageBreak(context, fontSize + tagPaddingY * 2 + tagGap);
    }
    
    // Enhanced tag styling based on template
    if (context.config.headerStyle === 'creative') {
      // Gradient-style tags for creative template
      context.pdf.setFillColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.setDrawColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
      context.pdf.setLineWidth(0.5);
      context.pdf.roundedRect(x, context.yPosition, skillW, fontSize + tagPaddingY * 2, 3, 3, 'FD');
      context.pdf.setTextColor(255, 255, 255);
    } else if (context.config.headerStyle === 'executive') {
      // Professional rectangular tags
      context.pdf.setFillColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
      context.pdf.rect(x, context.yPosition, skillW, fontSize + tagPaddingY * 2, 'F');
      context.pdf.setTextColor(255, 255, 255);
    } else {
      // Modern rounded tags
      context.pdf.setFillColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.roundedRect(x, context.yPosition, skillW, fontSize + tagPaddingY * 2, 2, 2, 'F');
      context.pdf.setTextColor(255, 255, 255);
    }
    
    context.pdf.text(skill, x + tagPaddingX, context.yPosition + fontSize + tagPaddingY/2 - 1);
    x += skillW + tagGap;
  }
  
  context.yPosition += fontSize + tagPaddingY * 2 + 10;
};
