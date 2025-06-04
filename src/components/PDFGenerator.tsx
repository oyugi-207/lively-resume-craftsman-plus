
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateResumePDF = async (resumeData: any, templateId: number, title: string) => {
  try {
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.minHeight = '297mm'; // A4 height
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '12px';
    tempContainer.style.lineHeight = '1.6';
    tempContainer.style.color = '#333';
    
    document.body.appendChild(tempContainer);

    // Generate HTML content based on template
    const htmlContent = generateTemplateHTML(resumeData, templateId);
    tempContainer.innerHTML = htmlContent;

    // Wait for any fonts/images to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate canvas from HTML
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // If content is longer than one page, add more pages
    if (imgHeight > 297) {
      let position = 297;
      while (position < imgHeight) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        position += 297;
      }
    }

    // Clean up
    document.body.removeChild(tempContainer);

    // Download the PDF
    pdf.save(`${title}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

const generateTemplateHTML = (data: any, templateId: number) => {
  const templates = [
    generateModernTemplate(data),
    generateCreativeTemplate(data),
    generateTechTemplate(data),
    generateExecutiveTemplate(data)
  ];
  
  return templates[templateId] || templates[0];
};

const generateModernTemplate = (data: any) => `
  <div style="max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 25px;">
      <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #333;">${data.personal.fullName}</h1>
      <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
        <span>${data.personal.email}</span>
        <span>${data.personal.phone}</span>
        <span>${data.personal.location}</span>
      </div>
    </div>

    ${data.personal.summary ? `
    <!-- Summary -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Professional Summary</h2>
      <p style="margin: 0; line-height: 1.6;">${data.personal.summary}</p>
    </div>
    ` : ''}

    ${data.experience.length > 0 ? `
    <!-- Experience -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Professional Experience</h2>
      ${data.experience.map((exp: any) => `
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <div>
              <h3 style="font-weight: bold; margin: 0; font-size: 14px;">${exp.position}</h3>
              <p style="margin: 0; color: #666;">${exp.company} • ${exp.location}</p>
            </div>
            <span style="color: #666; font-size: 12px;">${exp.startDate} - ${exp.endDate}</span>
          </div>
          <p style="margin: 5px 0 0 0; line-height: 1.6;">${exp.description}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${data.education.length > 0 ? `
    <!-- Education -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Education</h2>
      ${data.education.map((edu: any) => `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <h3 style="font-weight: bold; margin: 0; font-size: 14px;">${edu.degree}</h3>
              <p style="margin: 0; color: #666;">${edu.school} • ${edu.location}</p>
              ${edu.gpa ? `<p style="margin: 0; color: #666; font-size: 12px;">GPA: ${edu.gpa}</p>` : ''}
            </div>
            <span style="color: #666; font-size: 12px;">${edu.startDate} - ${edu.endDate}</span>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${data.skills.length > 0 ? `
    <!-- Skills -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Skills</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${data.skills.map((skill: string) => `
          <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${skill}</span>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${data.projects.length > 0 ? `
    <!-- Projects -->
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Projects</h2>
      ${data.projects.map((project: any) => `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <div>
              <h3 style="font-weight: bold; margin: 0; font-size: 14px;">${project.name}</h3>
              <p style="margin: 0; color: #666; font-size: 12px;">${project.technologies}</p>
            </div>
            <span style="color: #666; font-size: 12px;">${project.startDate} - ${project.endDate}</span>
          </div>
          <p style="margin: 5px 0 0 0; line-height: 1.6; font-size: 12px;">${project.description}</p>
          ${project.link ? `<p style="margin: 5px 0 0 0; font-size: 12px;"><a href="${project.link}" style="color: #0066cc;">${project.link}</a></p>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
  </div>
`;

const generateCreativeTemplate = (data: any) => `
  <div style="max-width: 800px; margin: 0 auto;">
    <!-- Header with gradient effect -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; text-align: center; margin-bottom: 25px;">
      <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">${data.personal.fullName}</h1>
      <div style="opacity: 0.9;">
        <div>${data.personal.email} • ${data.personal.phone}</div>
        <div style="margin-top: 5px;">${data.personal.location}</div>
      </div>
    </div>

    ${data.personal.summary ? `
    <!-- Summary -->
    <div style="background: #f8f9ff; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
      <h2 style="color: #667eea; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">About Me</h2>
      <p style="margin: 0; line-height: 1.6; color: #555;">${data.personal.summary}</p>
    </div>
    ` : ''}

    <!-- Continue with similar styling for other sections -->
    ${data.experience.length > 0 ? `
    <div style="margin-bottom: 25px;">
      <h2 style="color: #667eea; font-size: 18px; font-weight: bold; margin-bottom: 15px;">Experience</h2>
      ${data.experience.map((exp: any) => `
        <div style="border-left: 4px solid #667eea; padding-left: 15px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <div>
              <h3 style="font-weight: bold; margin: 0; font-size: 14px;">${exp.position}</h3>
              <p style="margin: 0; color: #667eea;">${exp.company} • ${exp.location}</p>
            </div>
            <span style="color: #666; font-size: 12px;">${exp.startDate} - ${exp.endDate}</span>
          </div>
          <p style="margin: 5px 0 0 0; line-height: 1.6;">${exp.description}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Add other sections with creative styling -->
  </div>
`;

const generateTechTemplate = (data: any) => `
  <div style="max-width: 800px; margin: 0 auto; font-family: 'Courier New', monospace;">
    <!-- Tech-style header -->
    <div style="background: #1a1a1a; color: #00ff00; padding: 20px; border-radius: 5px; margin-bottom: 25px;">
      <div style="margin-bottom: 10px;">
        <span style="color: #666;">$ </span>
        <span style="font-size: 20px; font-weight: bold;">${data.personal.fullName.toLowerCase().replace(' ', '_')}</span>
      </div>
      <div style="color: #00cc00; font-size: 12px;">
        <div>email: ${data.personal.email}</div>
        <div>phone: ${data.personal.phone}</div>
        <div>location: ${data.personal.location}</div>
      </div>
    </div>

    ${data.personal.summary ? `
    <div style="border: 1px solid #00ff00; padding: 15px; margin-bottom: 25px;">
      <h2 style="color: #00ff00; font-size: 16px; margin: 0 0 10px 0;">// Professional Summary</h2>
      <p style="margin: 0; line-height: 1.6;">${data.personal.summary}</p>
    </div>
    ` : ''}

    <!-- Continue with tech styling for other sections -->
  </div>
`;

const generateExecutiveTemplate = (data: any) => `
  <div style="max-width: 800px; margin: 0 auto;">
    <!-- Executive header -->
    <div style="text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
      <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 15px 0; letter-spacing: 2px;">${data.personal.fullName.toUpperCase()}</h1>
      <div style="display: flex; justify-content: center; gap: 30px; font-size: 14px;">
        <span>${data.personal.email}</span>
        <span>•</span>
        <span>${data.personal.phone}</span>
        <span>•</span>
        <span>${data.personal.location}</span>
      </div>
    </div>

    ${data.personal.summary ? `
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Executive Summary</h2>
      <p style="margin: 0; line-height: 1.8; font-style: italic;">${data.personal.summary}</p>
    </div>
    ` : ''}

    <!-- Continue with executive styling for other sections -->
  </div>
`;
