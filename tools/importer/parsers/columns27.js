/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns27)'];

  // --- LEFT COLUMN ---
  // Find the title and subtitle
  const titleWrap = element.querySelector('.cmp-available-store__title');
  let leftColContent = [];
  if (titleWrap) {
    leftColContent = Array.from(titleWrap.children); // h2 and p
  }

  // --- RIGHT COLUMN ---
  // Find the icons list (include ALL links, even those with display:none)
  const iconsListWrap = element.querySelector('.cmp-available-store__iconsList');
  let iconsLinks = [];
  if (iconsListWrap) {
    iconsLinks = Array.from(iconsListWrap.querySelectorAll('a'));
  }

  // Wrap icons in a div for horizontal layout
  let iconsDiv = null;
  if (iconsLinks.length) {
    iconsDiv = document.createElement('div');
    iconsDiv.style.display = 'flex';
    iconsDiv.style.gap = '1em';
    iconsLinks.forEach(a => iconsDiv.appendChild(a));
  }

  // Find the text below the icons
  const infoText = element.querySelector('.cmp-available-store__text');
  let rightColContent = [];
  if (iconsDiv) rightColContent.push(iconsDiv);
  if (infoText) rightColContent.push(infoText);

  // --- Build the table ---
  const cells = [
    headerRow,
    [leftColContent, rightColContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
