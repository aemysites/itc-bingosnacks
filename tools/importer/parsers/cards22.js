/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cards22)'];

  // Find the card container
  const container = element.querySelector('.cmp-card__container');
  if (!container) return;

  // Find all card links (each card is an <a> containing .cmp-card__content)
  const cardLinks = Array.from(container.querySelectorAll('a'));
  const rows = [headerRow];

  cardLinks.forEach((a) => {
    const cardContent = a.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // --- IMAGE CELL ---
    // Collect logo, Instagram icon, and main product image
    const imageCell = document.createElement('div');
    // Logo image (top left)
    const logoImg = cardContent.querySelector('.cmp-card__logo');
    if (logoImg) imageCell.appendChild(logoImg.cloneNode(true));
    // Instagram icon (top right)
    const instaImg = cardContent.querySelector('.cmp-card__facebook');
    if (instaImg) imageCell.appendChild(instaImg.cloneNode(true));
    // Main product image
    const productImg = cardContent.querySelector('.cmp-card__media img');
    if (productImg) imageCell.appendChild(productImg.cloneNode(true));

    // --- TEXT CELL ---
    const textCell = document.createElement('div');
    // Title (h3) and handle (p) from .cmp-card__title
    const titleBlock = cardContent.querySelector('.cmp-card__title');
    if (titleBlock) {
      const h3 = titleBlock.querySelector('h3');
      if (h3) textCell.appendChild(h3.cloneNode(true));
      const handle = titleBlock.querySelector('p');
      if (handle) textCell.appendChild(handle.cloneNode(true));
    }
    // Description
    const desc = cardContent.querySelector('.cmp-card__description p');
    if (desc) textCell.appendChild(desc.cloneNode(true));
    // CTA (View Post)
    const btn = cardContent.querySelector('.cmp-button__text');
    if (btn) {
      const ctaLink = document.createElement('a');
      ctaLink.href = a.href;
      ctaLink.textContent = btn.textContent;
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaLink);
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
