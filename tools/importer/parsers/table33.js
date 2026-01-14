/* global WebImporter */
export default function parse(element, { document }) {
  // Only run if this block contains a winners table
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the cmp-text block that contains the table
  const tableBlock = Array.from(grid.querySelectorAll('.cmp-text')).find(tb => tb.querySelector('table'));
  if (!tableBlock) return;

  const table = tableBlock.querySelector('table');
  if (!table) return;

  // Build rows for Table (table33)
  const rows = [];
  // First row: block name
  rows.push(['Table (table33)']);

  // Extract all tr elements from the source table
  Array.from(table.querySelectorAll('tr')).forEach(tr => {
    const cells = Array.from(tr.querySelectorAll('td')).map(td => {
      // Use the full cell element for each cell
      return td;
    });
    if (cells.length > 0) rows.push(cells);
  });

  // Replace only if we have more than just the header
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
