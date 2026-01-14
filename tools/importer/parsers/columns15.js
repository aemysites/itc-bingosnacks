/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns15)'];

  // Find the main content containers
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- LEFT COLUMN ---
  // The left column contains the main image and the small overlay image ONLY (do not fabricate text)
  const leftColumn = document.createElement('div');
  const mainImageWrap = teaser.querySelector('.cmp-teaser__image picture');
  if (mainImageWrap) leftColumn.appendChild(mainImageWrap.cloneNode(true));
  const smallImageWrap = teaser.querySelector('.cmp-animation picture');
  if (smallImageWrap) leftColumn.appendChild(smallImageWrap.cloneNode(true));

  // --- RIGHT COLUMN ---
  // The right column contains the headings and paragraph
  let rightColumn = null;
  const teaserDesc = teaser.querySelector('.cmp-teaser__description');
  if (teaserDesc) {
    rightColumn = teaserDesc.cloneNode(true);
  }

  // Build the table rows
  const cells = [
    headerRow,
    [leftColumn, rightColumn]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
