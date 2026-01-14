/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content wrapper
  const storeWrap = element.querySelector('.cmp-available-store__wrap');
  if (!storeWrap) return;

  // Get left column: title and subtitle
  const leftContent = storeWrap.querySelector('.cmp-available-store__title');
  let leftCol = document.createElement('div');
  if (leftContent) {
    // Include all text content (h2 and p)
    Array.from(leftContent.childNodes).forEach(node => {
      leftCol.appendChild(node.cloneNode(true));
    });
  }

  // Get right column: icons and info text
  const iconsList = storeWrap.querySelector('.cmp-available-store__iconsList');
  const infoText = storeWrap.querySelector('.cmp-available-store__text');

  // Defensive: Only include visible icons (display: block)
  let visibleIcons = [];
  if (iconsList) {
    visibleIcons = Array.from(iconsList.querySelectorAll('a'))
      .filter(a => a.style.display !== 'none')
      .map(a => a.cloneNode(true));
  }

  // Build right column: icons row + info text
  const rightCol = document.createElement('div');
  if (visibleIcons.length) {
    const iconsRow = document.createElement('div');
    iconsRow.style.display = 'flex';
    iconsRow.style.gap = '16px';
    visibleIcons.forEach(a => {
      a.removeAttribute('style');
      iconsRow.appendChild(a);
    });
    rightCol.appendChild(iconsRow);
  }
  if (infoText) {
    // Include all text content (not just the element)
    Array.from(infoText.childNodes).forEach(node => {
      rightCol.appendChild(node.cloneNode(true));
    });
  }

  // Compose table rows
  const headerRow = ['Columns (columns45)'];
  const contentRow = [leftCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
