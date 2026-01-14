/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card content blocks
  const cardContents = element.querySelectorAll('.cmp-card__content');

  // Prepare table rows
  const rows = [
    ['Carousel (carousel25)'], // Header row as per block guidelines
  ];

  cardContents.forEach(card => {
    // --- Media cell ---
    let mediaCell = '';
    const mediaWrapper = card.querySelector('.cmp-card__media');
    if (mediaWrapper) {
      // If there's an iframe, convert it to an image thumbnail using YouTube src
      const iframe = mediaWrapper.querySelector('iframe');
      if (iframe && iframe.src) {
        // Extract YouTube video ID
        const match = iframe.src.match(/\/embed\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          const videoId = match[1];
          const img = document.createElement('img');
          img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          img.alt = 'Video thumbnail';
          mediaCell = img;
        } else {
          // fallback to link if not a YouTube embed
          const link = document.createElement('a');
          link.href = iframe.src;
          link.textContent = iframe.src;
          mediaCell = link;
        }
      }
    }

    // --- Text cell ---
    let textCell = '';
    const info = card.querySelector('.cmp-card__info');
    if (info) {
      // Only extract description text, omit empty title divs
      const desc = info.querySelector('.cmp-card__description');
      if (desc) {
        // Use all child nodes in description
        const cellContent = [];
        Array.from(desc.childNodes).forEach(node => {
          if ((node.nodeType === Node.TEXT_NODE && node.textContent.trim()) || node.nodeType === Node.ELEMENT_NODE) {
            cellContent.push(node.cloneNode(true));
          }
        });
        if (cellContent.length === 1) {
          textCell = cellContent[0];
        } else if (cellContent.length > 1) {
          const div = document.createElement('div');
          cellContent.forEach(child => div.appendChild(child));
          textCell = div;
        }
      }
    }

    rows.push([mediaCell, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
