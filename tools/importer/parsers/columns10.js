/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Columns (columns10)'];

  // Find the main content wrapper
  const wrap = element.querySelector('.cmp-available-store__wrap');
  if (!wrap) return;

  // Left column: title and subtitle
  const content = wrap.querySelector('.cmp-available-store__content');
  let leftCol = '';
  if (content) {
    const title = content.querySelector('.cmp-available-store__title');
    if (title) {
      leftCol = title;
    }
  }

  // Right column: icons and text
  let rightCol = '';
  if (content) {
    const list = content.querySelector('.cmp-available-store__List');
    if (list) {
      // Get the icons
      const iconsList = list.querySelector('.cmp-available-store__iconsList');
      let icons = [];
      if (iconsList) {
        // Include ALL icons, regardless of display style
        icons = Array.from(iconsList.querySelectorAll('a'));
      }
      // Get the text under the icons
      const text = list.querySelector('.cmp-available-store__text');
      // Compose right column: icons row (as a div) + text
      const rightColDiv = document.createElement('div');
      if (icons.length) {
        const iconsRow = document.createElement('div');
        iconsRow.style.display = 'flex';
        iconsRow.style.gap = '16px';
        icons.forEach(icon => iconsRow.appendChild(icon));
        rightColDiv.appendChild(iconsRow);
      }
      if (text) {
        rightColDiv.appendChild(text);
      }
      rightCol = rightColDiv;
    }
  }

  // Build the table
  const cells = [
    headerRow,
    [leftCol, rightCol],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
