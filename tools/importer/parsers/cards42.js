/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards42)'];

  // Find all card content blocks
  const cardContents = element.querySelectorAll('.cmp-card__content');
  const rows = [];

  cardContents.forEach(cardContent => {
    // The card link wraps all content
    const cardLink = cardContent.querySelector(':scope > a');
    // Video (iframe) in the card
    const iframe = cardContent.querySelector('iframe');
    let videoCell = null;
    if (iframe) {
      // Use YouTube thumbnail for preview
      let videoId = null;
      const match = iframe.src.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        videoId = match[1];
      }
      let thumbnailImg = null;
      if (videoId) {
        thumbnailImg = document.createElement('img');
        thumbnailImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        thumbnailImg.alt = iframe.title || 'Video preview';
        thumbnailImg.loading = 'lazy';
      }
      // Make the thumbnail clickable, linking to the card's href (not the embed src)
      const videoLink = document.createElement('a');
      videoLink.href = cardLink ? cardLink.href : iframe.src;
      videoLink.target = '_self';
      videoLink.rel = 'noopener noreferrer';
      if (thumbnailImg) {
        videoLink.appendChild(thumbnailImg);
      } else {
        videoLink.textContent = 'Watch Video';
      }
      videoCell = videoLink;
    }

    // Info section (date, category, title)
    const info = cardContent.querySelector('.cmp-card__info');
    let textCellContent = [];
    let titleText = '';
    if (info) {
      // Date and category
      const dateDiv = info.querySelector('.cmp-card__date');
      if (dateDiv) {
        // Flatten date/category into a single line, separated by |
        const spans = Array.from(dateDiv.querySelectorAll('span'));
        const dateCat = spans.map(s => s.textContent.trim()).filter(Boolean).join(' | ');
        if (dateCat) {
          const dateP = document.createElement('p');
          dateP.textContent = dateCat;
          textCellContent.push(dateP);
        }
      }
      // Title
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        const h4 = titleDiv.querySelector('h4');
        if (h4) {
          titleText = h4.textContent.trim();
          // Use a heading for the title
          const heading = document.createElement('h3');
          heading.textContent = titleText;
          textCellContent.push(heading);
        }
      }
      // Description: Use the title text as description if no other description is present
      if (titleText) {
        const descP = document.createElement('p');
        descP.textContent = titleText;
        textCellContent.push(descP);
      }
    }

    // Make the text cell a link if the card has a link
    if (cardLink && cardLink.href && textCellContent.length > 0) {
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.target = '_self';
      textCellContent.forEach(node => link.appendChild(node));
      textCellContent = [link];
    }

    // Add the row: [video, text content]
    rows.push([videoCell, textCellContent]);
  });

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
