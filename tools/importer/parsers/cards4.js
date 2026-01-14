/* global WebImporter */

export default function parse(element, { document }) {
  // Header row for Cards (cards4)
  const headerRow = ['Cards (cards4)'];

  // Find all card content blocks
  const cardContents = Array.from(element.querySelectorAll('.cmp-card__content'));

  const cardRows = cardContents.map((card) => {
    // Video iframe: convert to link
    const media = card.querySelector('.cmp-card__media iframe');
    let mediaCell = null;
    if (media && media.src) {
      const a = document.createElement('a');
      a.href = media.src;
      a.textContent = 'YouTube Video';
      mediaCell = a;
    }

    // Text content: include all visible info content
    let textCell = document.createElement('div');

    // Extract channel name from iframe title if present
    if (media && media.title && media.title.trim()) {
      const channel = document.createElement('strong');
      channel.textContent = media.title.trim();
      textCell.appendChild(channel);
      textCell.appendChild(document.createElement('br'));
    }

    // Add card info
    const info = card.querySelector('.cmp-card__info');
    if (info) {
      // Title (may be empty)
      const title = info.querySelector('.cmp-card__title');
      if (title && title.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.appendChild(h3);
      }
      // Description
      const desc = info.querySelector('.cmp-card__description');
      if (desc) {
        Array.from(desc.childNodes).forEach((node) => {
          textCell.appendChild(node.cloneNode(true));
        });
      }
    }

    // Special case: third card includes author credit (Kapil Kasupuriya)
    // Only add if present in HTML
    if (card.textContent.includes('Kapil Kasupuriya')) {
      const credit = document.createElement('div');
      credit.textContent = 'Kapil Kasupuriya';
      textCell.appendChild(credit);
    }

    return [mediaCell, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  element.replaceWith(table);
}
