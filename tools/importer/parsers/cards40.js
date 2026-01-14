/* global WebImporter */

export default function parse(element, { document }) {
  // Cards (cards40) block header row
  const headerRow = ['Cards (cards40)'];

  // Find all card anchor wrappers (each card is an <a> containing .cmp-card__content)
  const cardLinks = Array.from(element.querySelectorAll('.cmp-card__container > a'));

  // Build rows for each card
  const rows = cardLinks.map((a) => {
    // Image: .cmp-card__media img (inside <picture>)
    const img = a.querySelector('.cmp-card__media img');
    // Reference the actual image element (do not clone)
    // Text content: date/category, title/description
    const info = a.querySelector('.cmp-card__info');
    // Reference the existing info element (do not clone)
    // Optionally, add the link as a CTA at the bottom of the text cell
    // (Not visible in screenshot, but spec allows for it)
    let infoCell = info;
    if (a.href) {
      // Only add CTA if not already present
      const hasCTA = info && info.querySelector('a');
      if (!hasCTA) {
        // Create a paragraph for the CTA
        const cta = document.createElement('p');
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = 'Read more';
        link.target = a.target || '_self';
        cta.appendChild(link);
        infoCell.appendChild(cta);
      }
    }
    return [img, infoCell];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
