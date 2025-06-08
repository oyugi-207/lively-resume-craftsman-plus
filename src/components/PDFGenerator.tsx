
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generatePDF(element: HTMLElement, filename: string = 'resume.pdf'): Promise<void> {
    try {
      // Ensure the element is visible and properly rendered
      const originalDisplay = element.style.display;
      const originalPosition = element.style.position;
      const originalTop = element.style.top;
      const originalLeft = element.style.left;
      
      // Temporarily make element visible and positioned for capture
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.top = '-9999px';
      element.style.left = '-9999px';
      
      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        onclone: (clonedDoc) => {
          // Apply styles to cloned document
          const clonedElement = clonedDoc.querySelector('[data-pdf-element]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '794px';
            clonedElement.style.height = 'auto';
            clonedElement.style.padding = '40px';
            clonedElement.style.fontFamily = 'Arial, sans-serif';
            clonedElement.style.fontSize = '14px';
            clonedElement.style.lineHeight = '1.5';
            clonedElement.style.color = '#000000';
            clonedElement.style.backgroundColor = '#ffffff';
          }
        }
      });

      // Restore original styles
      element.style.display = originalDisplay;
      element.style.position = originalPosition;
      element.style.top = originalTop;
      element.style.left = originalLeft;

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgDisplayWidth = imgWidth * ratio;
      const imgDisplayHeight = imgHeight * ratio;
      
      // Center the content
      const x = (pdfWidth - imgDisplayWidth) / 2;
      const y = (pdfHeight - imgDisplayHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgDisplayWidth, imgDisplayHeight);
      
      // Add metadata
      pdf.setProperties({
        title: filename,
        subject: 'Professional Resume',
        author: 'Resume Builder Pro',
        creator: 'Resume Builder Pro'
      });
      
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAdvancedPDF(element: HTMLElement, filename: string = 'resume.pdf', options: any = {}): Promise<void> {
    try {
      // Enhanced PDF generation with better formatting
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Center the image
      const x = (pdfWidth - scaledWidth) / 2;
      const y = margin;

      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating advanced PDF:', error);
      throw error;
    }
  }
}

export default PDFGenerator;
