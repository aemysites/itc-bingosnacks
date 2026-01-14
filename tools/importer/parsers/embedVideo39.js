/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row for Embed (embedVideo39)
  const headerRow = ['Embed (embedVideo39)'];

  // Find the iframe (YouTube embed)
  const iframe = element.querySelector('iframe[src*="youtube"]');
  let videoUrl = '';
  let videoTitle = '';
  if (iframe) {
    // Extract the YouTube video ID from the src attribute
    const src = iframe.getAttribute('src') || '';
    // Typical src: https://www.youtube.com/embed/8ephFnX16L0?...params
    const match = src.match(/youtube.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      // fallback, just use the src
      videoUrl = src;
    }
    // Extract the video title from the iframe title attribute
    videoTitle = iframe.getAttribute('title') || '';
  }

  // Collect all visible text content from the element (for flexibility)
  let extraText = '';
  // Get all text nodes inside the element, excluding script/style
  element.querySelectorAll('*:not(script):not(style)').forEach((el) => {
    if (el.childNodes.length) {
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          extraText += node.textContent.trim() + '\n';
        }
      });
    }
  });
  extraText = extraText.trim();

  // Build the title element (if any text content is found)
  const titleElem = document.createElement('div');
  titleElem.textContent = videoTitle || extraText;

  // Build the link element for the video URL
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Include the video title or extra text above the link in the cell
  const contentRow = [[titleElem, link]];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
