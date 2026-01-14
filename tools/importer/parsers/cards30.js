/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block header - must be a single column
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Select all card links (each card is an <a> with class cmp-product-list__link)
  const cardLinks = element.querySelectorAll('.cmp-product-list__link');

  cardLinks.forEach((card) => {
    // --- IMAGE/VIDEO POSTER ---
    // The image is the <video> poster attribute inside .cmp-product-list__content--image
    const video = card.querySelector('video');
    let imgEl = null;
    if (video && video.hasAttribute('poster')) {
      imgEl = document.createElement('img');
      imgEl.src = video.getAttribute('poster');
      imgEl.alt = card.getAttribute('data-title') || '';
    }

    // --- TITLE ---
    // The title is in the data-title attribute of the <a>
    let titleEl = null;
    const title = card.getAttribute('data-title');
    if (title) {
      titleEl = document.createElement('h3');
      titleEl.textContent = title;
    }

    // --- DESCRIPTION ---
    // The description is in .cmp-product-list__details-description
    let descEl = null;
    const desc = card.querySelector('.cmp-product-list__details-description');
    if (desc) {
      descEl = document.createElement('p');
      descEl.textContent = desc.textContent;
    }

    // --- Assemble text cell ---
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
