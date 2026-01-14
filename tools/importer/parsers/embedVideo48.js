/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo48)
  const headerRow = ['Embed (embedVideo48)'];

  // Find the iframe (video embed)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  if (iframe && iframe.src) {
    const src = iframe.src;
    const youtubeMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
    } else {
      videoUrl = src;
    }
  }

  // Extract visible text content from the source html (such as video title)
  // Try to get the title from iframe attribute, or from the parent div's textContent
  let videoTitle = '';
  if (iframe && iframe.title) {
    videoTitle = iframe.title;
  } else {
    // Fallback: get text content from the parent div
    const divText = element.textContent.trim();
    if (divText) {
      videoTitle = divText;
    }
  }

  // Compose cell content: title (if present) above the link
  const cellContent = [];
  if (videoTitle) {
    const titleEl = document.createElement('div');
    titleEl.textContent = videoTitle;
    cellContent.push(titleEl);
  }
  if (videoUrl) {
    const linkEl = document.createElement('a');
    linkEl.href = videoUrl;
    linkEl.textContent = videoUrl;
    cellContent.push(linkEl);
  }

  // Content row: single cell with all content
  const contentRow = [cellContent.length ? cellContent : ''];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
