
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
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '210mm'; // A4 width
      clone.style.minHeight = '297mm'; // A4 height
      clone.style.backgroundColor = '#ffffff';
      clone.style.transform = 'scale(1)';
      clone.style.transformOrigin = 'top left';
      clone.style.fontFamily = 'Arial, sans-serif';
      
      // Append clone to body
      document.body.appendChild(clone);

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture with high quality settings
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: Math.round(210 * 3.78), // A4 width in pixels at 96 DPI
        height: Math.round(297 * 3.78), // A4 height in pixels at 96 DPI
        scrollX: 0,
        scrollY: 0,
        windowWidth: Math.round(210 * 3.78),
        windowHeight: Math.round(297 * 3.78),
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied to the cloned document
          const clonedElement = clonedDoc.body.querySelector('[data-resume-preview]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.maxWidth = 'none';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '20px';
            clonedElement.style.boxShadow = 'none';
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
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multi-page content
      if (imgHeight > pdfHeight) {
        let position = 0;
        const pageHeight = (canvas.width * pdfHeight) / pdfWidth;
        
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
          
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, (pageCanvas.height * imgWidth) / canvas.width);
          position += pageHeight;
        }
      } else {
        // Single page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      // Add metadata
      pdf.setProperties({
        title: filename.replace('.pdf', ''),
        subject: 'Professional Resume',
        author: 'Resume Builder',
        creator: 'AI Resume Builder',
        keywords: 'resume, cv, professional'
      });
      
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateCoverLetterPDF(element: HTMLElement, filename: string = 'cover-letter.pdf') {
    try {
      // Similar process but optimized for cover letter format
      const elementsToHide = element.querySelectorAll('.no-print, .hover\\:opacity-100');
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '210mm';
      clone.style.minHeight = '297mm';
      clone.style.backgroundColor = '#ffffff';
      clone.style.padding = '25mm 20mm';
      clone.style.boxSizing = 'border-box';
      clone.style.fontFamily = 'Arial, sans-serif';
      clone.style.fontSize = '11pt';
      clone.style.lineHeight = '1.5';
      
      document.body.appendChild(clone);
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: Math.round(210 * 3.78),
        height: Math.round(297 * 3.78)
      });

      document.body.removeChild(clone);
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      
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
}

export default PDFGenerator;
