
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generatePDF(element: HTMLElement, filename: string = 'resume.pdf') {
    try {
      // Hide any unwanted elements before capture
      const elementsToHide = element.querySelectorAll('.no-print');
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      // Temporarily adjust the element for better PDF rendering
      const originalStyle = {
        width: element.style.width,
        height: element.style.height,
        transform: element.style.transform,
        position: element.style.position
      };

      // Set optimal dimensions for PDF
      element.style.width = '794px'; // A4 width in pixels at 96 DPI
      element.style.height = 'auto';
      element.style.transform = 'scale(1)';
      element.style.position = 'relative';

      // Wait for any dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // Restore original styles
      element.style.width = originalStyle.width;
      element.style.height = originalStyle.height;
      element.style.transform = originalStyle.transform;
      element.style.position = originalStyle.position;

      // Show hidden elements again
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is longer than one page, handle pagination
      if (imgHeight > pdfHeight) {
        let position = 0;
        const pageHeight = (canvas.width * pdfHeight) / pdfWidth;
        
        while (position < canvas.height) {
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d')!;
          
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pageHeight, canvas.height - position);
          
          pageCtx.drawImage(
            canvas,
            0, position, canvas.width, pageCanvas.height,
            0, 0, canvas.width, pageCanvas.height
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, (pageCanvas.height * imgWidth) / canvas.width);
          position += pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}

export default PDFGenerator;
