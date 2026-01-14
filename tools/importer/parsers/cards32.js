/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cards32)'];

  // Find all card anchor elements (each card is an <a> with .cmp-card__content)
  const cardLinks = element.querySelectorAll('a > .cmp-card__content');
  const rows = [headerRow];

  cardLinks.forEach(cardContent => {
    // The anchor element
    const anchor = cardContent.parentElement;

    // --- IMAGE CELL ---
    // Find the image inside the card
    const media = cardContent.querySelector('.cmp-card__media img');
    let imageEl = null;
    if (media) {
      // Clone image and preserve all attributes
      imageEl = media.cloneNode(true);
    }

    // --- TEXT CELL ---
    // Date/category
    const dateCat = cardContent.querySelector('.cmp-card__title p');
    // Title (h4)
    const title = cardContent.querySelector('.cmp-card__description h4');
    const textContent = [];
    if (dateCat) {
      textContent.push(dateCat.cloneNode(true));
    }
    if (title) {
      // Use h4 for heading, as in original HTML
      const h = document.createElement('h4');
      h.textContent = title.textContent;
      textContent.push(h);
    }
    // Do NOT add a visible CTA link unless present in the card content

    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Replace the original element with the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
