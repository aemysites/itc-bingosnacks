/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo46)
  const headerRow = ['Embed (embedVideo46)'];

  // Find the iframe inside the embed block
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  let videoTitle = '';

  if (iframe && iframe.src) {
    // Extract the YouTube video ID from the src
    const match = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      videoUrl = iframe.src;
    }
  }

  // Get the video title from the iframe's title attribute
  if (iframe && iframe.title) {
    videoTitle = iframe.title;
  }

  // Create cell content: video title (if present) above the link
  const cellContent = [];
  if (videoTitle) {
    cellContent.push(videoTitle);
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  const cells = [
    headerRow,
    [cellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
