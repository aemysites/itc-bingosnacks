/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards43)'];

  // Find all card anchor elements (each card is an <a> with .cmp-card__content)
  const cardLinks = Array.from(element.querySelectorAll('a'));

  // Build rows for each card
  const rows = cardLinks.map(cardLink => {
    // Find image (inside <picture> inside .cmp-card__media)
    const media = cardLink.querySelector('.cmp-card__media picture');
    let imageEl = null;
    if (media) {
      const img = media.querySelector('img');
      if (img) {
        imageEl = img.cloneNode(true); // preserve all attributes
      }
    }

    // Find text content (date/category, title, description)
    const info = cardLink.querySelector('.cmp-card__info');
    // Defensive: create a wrapper div for all text content
    const textWrapper = document.createElement('div');
    if (info) {
      // Date/category
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        const dateP = titleDiv.querySelector('p');
        if (dateP) textWrapper.appendChild(dateP.cloneNode(true));
      }
      // Card heading/title
      const descDiv = info.querySelector('.cmp-card__description');
      if (descDiv) {
        const h4 = descDiv.querySelector('h4');
        if (h4) textWrapper.appendChild(h4.cloneNode(true));
      }
    }
    // Do NOT add a 'Read more' CTA, only preserve original text content

    // Each row: [image, text content]
    return [imageEl, textWrapper];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
