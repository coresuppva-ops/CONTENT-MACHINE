import { SocialPost, VideoScript, UserInputs } from "../types";
import { jsPDF } from "jspdf";

export const downloadTXT = (filename: string, text: string) => {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadCSV = (filename: string, rows: string[][]) => {
  const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePostText = (posts: SocialPost[], inputs: UserInputs): string => {
  let content = `SOCIAL MEDIA CALENDAR - ${inputs.niche.toUpperCase()}\n`;
  content += `Strategy: ${inputs.tone} | Audience: ${inputs.audience}\n\n`;
  
  posts.forEach(post => {
    content += `DAY ${post.day} (${post.scheduleTime})\n`;
    content += `CAPTION: ${post.caption}\n`;
    content += `HASHTAGS: ${post.hashtags.join(' ')}\n`;
    content += `----------------------------\n\n`;
  });
  return content;
};

export const generateScriptText = (scripts: VideoScript[]): string => {
  let content = `VIDEO SCRIPTS\n\n`;
  scripts.forEach((script, idx) => {
    content += `SCRIPT ${idx + 1}: ${script.title} (${script.duration})\n`;
    content += `MUSIC: ${script.music || 'N/A'}\n`;
    content += `HOOK: ${script.hook}\n`;
    content += `VISUAL: ${script.visuals}\n`;
    content += `BODY: ${script.body}\n`;
    content += `CTA: ${script.cta}\n`;
    content += `----------------------------\n\n`;
  });
  return content;
};

export const exportProjectPDF = (inputs: UserInputs, posts: SocialPost[], scripts: VideoScript[]) => {
  const doc = new jsPDF();
  let yPos = 20;
  const pageHeight = doc.internal.pageSize.height;

  // Title
  doc.setFontSize(18);
  doc.text("30-Day Social Media Content Plan", 14, yPos);
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text(`Niche: ${inputs.niche}`, 14, yPos);
  yPos += 7;
  doc.text(`Target Audience: ${inputs.audience}`, 14, yPos);
  yPos += 15;

  // Posts
  doc.setFontSize(14);
  doc.text("Daily Posts", 14, yPos);
  yPos += 10;

  doc.setFontSize(10);
  posts.forEach((post) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Day ${post.day} - ${post.scheduleTime}`, 14, yPos);
    yPos += 5;
    
    doc.setFont("helvetica", "normal");
    const splitCaption = doc.splitTextToSize(post.caption, 180);
    doc.text(splitCaption, 14, yPos);
    yPos += (splitCaption.length * 5) + 2;
    
    const tags = post.hashtags.join(" ");
    const splitTags = doc.splitTextToSize(tags, 180);
    doc.setTextColor(100);
    doc.text(splitTags, 14, yPos);
    doc.setTextColor(0);
    yPos += (splitTags.length * 5) + 10;
  });

  // Scripts
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.text("Video Scripts", 14, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  scripts.forEach((script) => {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Title: ${script.title} (${script.duration})`, 14, yPos);
    yPos += 6;

    if (script.music) {
      doc.setFont("helvetica", "italic");
      doc.text(`Music: ${script.music}`, 14, yPos);
      yPos += 6;
    }
    
    doc.setFont("helvetica", "normal");
    doc.text(`Hook: ${script.hook}`, 14, yPos);
    yPos += 6;
    
    const splitBody = doc.splitTextToSize(`Body: ${script.body}`, 180);
    doc.text(splitBody, 14, yPos);
    yPos += (splitBody.length * 5) + 2;

    const splitVisuals = doc.splitTextToSize(`Visuals: ${script.visuals}`, 180);
    doc.text(splitVisuals, 14, yPos);
    yPos += (splitVisuals.length * 5) + 6;
    
    doc.text(`CTA: ${script.cta}`, 14, yPos);
    yPos += 12;
  });

  doc.save("social-media-plan.pdf");
};