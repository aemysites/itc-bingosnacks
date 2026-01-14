/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards44) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards44)'];
  const rows = [headerRow];

  // Defensive selectors for card structure
  // Image: .cmp-product-list__logo img
  // Text: .cmp-product-list__heading (contains h2 and p)
  const logoDiv = element.querySelector('.cmp-product-list__logo');
  const img = logoDiv && logoDiv.querySelector('img');

  const headingDiv = element.querySelector('.cmp-product-list__heading');
  let textContent = [];
  if (headingDiv) {
    // Title (h2)
    const h2 = headingDiv.querySelector('h2');
    if (h2) textContent.push(h2);
    // Description (p)
    const desc = headingDiv.querySelector('p');
    if (desc) textContent.push(desc);
  }

  // Build card row: [image, text content]
  rows.push([
    img || '',
    textContent.length ? textContent : ''
  ]);

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
