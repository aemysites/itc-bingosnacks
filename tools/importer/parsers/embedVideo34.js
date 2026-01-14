/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed block
  const headerRow = ['Embed (embedVideo34)'];

  // Extract the video URL from the iframe or data attribute
  let videoUrl = '';
  const iframe = element.querySelector('iframe[src*="youtube"]');
  if (iframe) {
    videoUrl = iframe.getAttribute('src'); // Use the original embed URL
  } else {
    const ytDiv = element.querySelector('[data-youtube-url]');
    if (ytDiv) {
      videoUrl = ytDiv.getAttribute('data-youtube-url');
    }
  }

  // Extract all visible text content from the block (including headings, paragraphs, and marketing text)
  const textContents = [];
  // Get all text nodes inside cmp-adda__content
  const contentDiv = element.querySelector('.cmp-adda__content');
  if (contentDiv) {
    // Collect all text from headings, paragraphs, and direct text nodes
    contentDiv.querySelectorAll('h2, p, span, strong, em').forEach((node) => {
      if (node.textContent.trim()) {
        textContents.push(node.textContent.trim());
      }
    });
    // Also include any direct text nodes
    if (contentDiv.childNodes.length) {
      contentDiv.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textContents.push(node.textContent.trim());
        }
      });
    }
  }
  // Also include iframe title if present
  if (iframe && iframe.title) {
    textContents.push(iframe.title);
  }

  // Compose all content for the cell
  let cellContent = '';
  if (textContents.length) {
    cellContent += textContents.join(' ') + '\n';
  }
  if (videoUrl) {
    cellContent += videoUrl;
  }
  if (!cellContent) {
    cellContent = '';
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);

  element.replaceWith(table);
}
