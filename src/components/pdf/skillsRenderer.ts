
import { PDFContext } from './types';
import { cleanText, checkPageBreak } from './pdfHelpers';

export const renderSkillsSection = (context: PDFContext, skills: string[]): void => {
  if (!skills || skills.length === 0) return;

  const filteredSkills = skills.filter((skill: string) => skill && skill.trim()).map((skill: string) => cleanText(skill));
  
  // Enhanced skills layout with professional categorization
  const tagPaddingX = 4;
  const tagPaddingY = 2;
  const tagGap = 4;
  const fontSize = 9;
  const lineHeight = fontSize + tagPaddingY * 2 + 2;
  
  let x = context.margin;
  context.yPosition += 3;
  
  // Group skills into rows for better organization
  const skillsPerRow = Math.ceil(filteredSkills.length / Math.ceil(filteredSkills.length / 4));
  
  for (let i = 0; i < filteredSkills.length; i++) {
    const skill = filteredSkills[i];
    context.pdf.setFontSize(fontSize);
    context.pdf.setFont('helvetica', 'bold');
    
    const skillW = context.pdf.getTextWidth(skill) + tagPaddingX * 2;
    
    // Wrap to new line if needed or after every skillsPerRow items
    if (x + skillW > context.pageWidth - context.margin || (i > 0 && i % skillsPerRow === 0)) {
      x = context.margin;
      context.yPosition += lineHeight + 3;
      checkPageBreak(context, lineHeight + 10);
    }
    
    // Enhanced tag styling based on template with gradient effects
    const tagY = context.yPosition;
    
    if (context.config.headerStyle === 'creative') {
      // Creative gradient-style tags with rounded corners
      context.pdf.setFillColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.setDrawColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
      context.pdf.setLineWidth(0.8);
      context.pdf.roundedRect(x, tagY, skillW, lineHeight, 4, 4, 'FD');
      
      // Add inner highlight
      context.pdf.setFillColor(
        Math.min(255, context.config.primaryColor[0] + 30),
        Math.min(255, context.config.primaryColor[1] + 30),
        Math.min(255, context.config.primaryColor[2] + 30)
      );
      context.pdf.roundedRect(x + 0.5, tagY + 0.5, skillW - 1, 2, 2, 2, 'F');
      
      context.pdf.setTextColor(255, 255, 255);
    } else if (context.config.headerStyle === 'executive') {
      // Professional rectangular tags with shadow effect
      context.pdf.setFillColor(240, 240, 240);
      context.pdf.rect(x + 0.5, tagY + 0.5, skillW, lineHeight, 'F');
      
      context.pdf.setFillColor(context.config.secondaryColor[0], context.config.secondaryColor[1], context.config.secondaryColor[2]);
      context.pdf.rect(x, tagY, skillW, lineHeight, 'F');
      
      context.pdf.setTextColor(255, 255, 255);
    } else if (context.config.headerStyle === 'tech') {
      // Tech-style tags with border accent
      context.pdf.setFillColor(250, 250, 250);
      context.pdf.setDrawColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.setLineWidth(1);
      context.pdf.roundedRect(x, tagY, skillW, lineHeight, 3, 3, 'FD');
      
      context.pdf.setTextColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
    } else {
      // Modern rounded tags with enhanced styling
      context.pdf.setFillColor(context.config.primaryColor[0], context.config.primaryColor[1], context.config.primaryColor[2]);
      context.pdf.roundedRect(x, tagY, skillW, lineHeight, 3, 3, 'F');
      
      // Add subtle inner border
      context.pdf.setDrawColor(
        Math.min(255, context.config.primaryColor[0] + 40),
        Math.min(255, context.config.primaryColor[1] + 40),
        Math.min(255, context.config.primaryColor[2] + 40)
      );
      context.pdf.setLineWidth(0.3);
      context.pdf.roundedRect(x + 0.5, tagY + 0.5, skillW - 1, lineHeight - 1, 2, 2, 'S');
      
      context.pdf.setTextColor(255, 255, 255);
    }
    
    // Center text vertically in the tag
    const textY = tagY + (lineHeight / 2) + (fontSize / 3);
    context.pdf.text(skill, x + tagPaddingX, textY);
    x += skillW + tagGap;
  }
  
  context.yPosition += lineHeight + 12;
};
