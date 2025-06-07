
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generatePDF(element: HTMLElement, filename: string = 'resume.pdf') {
    try {
      // Hide any unwanted elements before capture
      const elementsToHide = element.querySelectorAll('.no-print, .hover\\:opacity-100, .group-hover\\:opacity-100');
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      // Create a clone to avoid modifying the original
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Improved styling for better PDF output
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '794px'; // A4 width in pixels (210mm * 3.78)
      clone.style.minHeight = '1123px'; // A4 height in pixels (297mm * 3.78)
      clone.style.maxWidth = '794px';
      clone.style.backgroundColor = '#ffffff';
      clone.style.transform = 'scale(1)';
      clone.style.transformOrigin = 'top left';
      clone.style.fontFamily = 'Arial, sans-serif';
      clone.style.padding = '40px';
      clone.style.margin = '0';
      clone.style.boxSizing = 'border-box';
      clone.style.overflow = 'visible';
      
      // Enhanced bullet point styling
      const bulletPoints = clone.querySelectorAll('li, .bullet-point');
      bulletPoints.forEach((bullet: any) => {
        if (bullet.style) {
          bullet.style.marginBottom = '8px';
          bullet.style.lineHeight = '1.6';
          bullet.style.paddingLeft = '8px';
          // Ensure bullet points are visible
          bullet.style.listStyleType = 'disc';
          bullet.style.listStylePosition = 'outside';
          bullet.style.marginLeft = '20px';
        }
      });
      
      // Ensure proper text rendering
      const allTextElements = clone.querySelectorAll('*');
      allTextElements.forEach((el: any) => {
        if (el.style) {
          el.style.webkitFontSmoothing = 'antialiased';
          el.style.mozOsxFontSmoothing = 'grayscale';
          // Fix text color for PDF
          el.style.color = el.style.color || '#000000';
        }
      });
      
      // Append clone to body
      document.body.appendChild(clone);

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Capture with optimized settings
      const canvas = await html2canvas(clone, {
        scale: 3, // Higher resolution
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied to the cloned document
          const clonedElement = clonedDoc.body.lastElementChild as HTMLElement;
          if (clonedElement) {
            clonedElement.style.maxWidth = '794px';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '40px';
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.border = 'none';
            clonedElement.style.backgroundColor = '#ffffff';
            
            // Fix bullet points in cloned document
            const clonedBullets = clonedElement.querySelectorAll('li, .bullet-point');
            clonedBullets.forEach((bullet: any) => {
              bullet.style.display = 'list-item';
              bullet.style.listStyleType = 'disc';
              bullet.style.marginLeft = '20px';
              bullet.style.paddingLeft = '8px';
            });
          }
        }
      });

      // Clean up
      document.body.removeChild(clone);
      
      // Show hidden elements again
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page content if needed
      if (imgHeight > pdfHeight) {
        let position = 0;
        const pageHeight = (canvas.width * pdfHeight) / pdfWidth;
        let pageNum = 0;
        
        while (position < canvas.height) {
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d')!;
          
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pageHeight, canvas.height - position);
          
          // Fill background white
          pageCtx.fillStyle = '#ffffff';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          
          pageCtx.drawImage(
            canvas,
            0, position, canvas.width, pageCanvas.height,
            0, 0, canvas.width, pageCanvas.height
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
          
          if (pageNum > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, (pageCanvas.height * imgWidth) / canvas.width, '', 'FAST');
          position += pageHeight;
          pageNum++;
        }
      } else {
        // Single page - fit to page properly
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight), '', 'FAST');
      }
      
      // Add metadata
      pdf.setProperties({
        title: filename.replace('.pdf', ''),
        subject: 'Professional Resume',
        author: 'Resume Builder',
        creator: 'AI Resume Builder',
        keywords: 'resume, cv, professional, ats'
      });
      
      // Download the PDF
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateCoverLetterPDF(element: HTMLElement, filename: string = 'cover-letter.pdf') {
    try {
      // Hide any unwanted elements before capture
      const elementsToHide = element.querySelectorAll('.no-print, .hover\\:opacity-100');
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      const clone = element.cloneNode(true) as HTMLElement;
      
      // Optimized styling for cover letter
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '794px'; // A4 width
      clone.style.minHeight = '1123px'; // A4 height
      clone.style.maxWidth = '794px';
      clone.style.backgroundColor = '#ffffff';
      clone.style.padding = '60px 50px'; // Better margins for cover letter
      clone.style.boxSizing = 'border-box';
      clone.style.fontFamily = 'Arial, sans-serif';
      clone.style.fontSize = '11pt';
      clone.style.lineHeight = '1.6';
      clone.style.margin = '0';
      clone.style.overflow = 'visible';
      
      // Ensure proper text spacing for cover letters
      const paragraphs = clone.querySelectorAll('p');
      paragraphs.forEach((p: any) => {
        p.style.marginBottom = '16px';
        p.style.textAlign = 'left';
        p.style.color = '#000000';
      });
      
      document.body.appendChild(clone);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true
      });

      document.body.removeChild(clone);
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Fit cover letter to page with no top spacing issues
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297), '', 'FAST');
      
      pdf.setProperties({
        title: filename.replace('.pdf', ''),
        subject: 'Professional Cover Letter',
        author: 'Resume Builder',
        creator: 'AI Resume Builder'
      });
      
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('Cover letter PDF generation error:', error);
      throw new Error('Failed to generate cover letter PDF. Please try again.');
    }
  }
  
  // Enhanced method for DOCX export (placeholder for future implementation)
  static async generateDOCX(element: HTMLElement, filename: string = 'resume.docx') {
    // This would require a DOCX library like docx or mammoth
    throw new Error('DOCX export is not implemented yet. Please use PDF export for now.');
  }
}

export default PDFGenerator;
