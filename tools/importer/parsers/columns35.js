/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns35)'];

  // --- COLUMN 1: Title and subtext ---
  // Find the title and subtext
  const titleWrap = element.querySelector('.cmp-available-store__title');
  let col1Content = [];
  if (titleWrap) {
    const heading = titleWrap.querySelector('h2');
    if (heading) col1Content.push(heading);
    const subtext = titleWrap.querySelector('p');
    if (subtext) col1Content.push(subtext);
  }

  // --- COLUMN 2: Store icons and info text ---
  // Find all icons (include even those with display:none)
  const iconsList = element.querySelector('.cmp-available-store__iconsList');
  let allIcons = [];
  if (iconsList) {
    allIcons = Array.from(iconsList.querySelectorAll('a'));
  }
  // Find the info text
  const infoTextWrap = element.querySelector('.cmp-available-store__text');
  let infoText = null;
  if (infoTextWrap) {
    infoText = infoTextWrap.querySelector('p');
  }
  // Compose column 2 content
  const col2Content = [];
  if (allIcons.length > 0) {
    const iconsDiv = document.createElement('div');
    allIcons.forEach(a => iconsDiv.appendChild(a));
    col2Content.push(iconsDiv);
  }
  if (infoText) col2Content.push(infoText);

  // --- Compose the table ---
  const tableRows = [
    headerRow,
    [col1Content, col2Content]
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
