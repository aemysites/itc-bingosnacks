/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel3)'];

  // Find all card content blocks
  const cardContents = element.querySelectorAll('.cmp-card__content');

  const rows = [headerRow];

  cardContents.forEach(card => {
    // Left cell: Video thumbnail image ONLY (no link)
    const mediaWrapper = card.querySelector('.cmp-card__media');
    let leftCell = '';
    if (mediaWrapper) {
      const iframe = mediaWrapper.querySelector('iframe');
      if (iframe && iframe.src) {
        // Extract YouTube video ID from src
        const match = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          const videoId = match[1];
          // Use YouTube thumbnail
          const img = document.createElement('img');
          img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          img.alt = 'Video thumbnail';
          leftCell = img;
        }
      }
    }

    // Right cell: Text content (title if present, then description)
    const info = card.querySelector('.cmp-card__info');
    let rightCellContent = [];
    if (info) {
      // Title (if present and not empty)
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = titleDiv.textContent.trim();
        rightCellContent.push(h2);
      }
      // Description
      const descDiv = info.querySelector('.cmp-card__description');
      if (descDiv) {
        Array.from(descDiv.children).forEach(child => {
          const p = document.createElement('p');
          p.textContent = child.textContent.trim();
          rightCellContent.push(p);
        });
        if (descDiv.children.length === 0 && descDiv.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = descDiv.textContent.trim();
          rightCellContent.push(p);
        }
      }
    }
    if (rightCellContent.length === 0) rightCellContent = [''];

    rows.push([leftCell, rightCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
