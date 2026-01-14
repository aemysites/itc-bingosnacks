/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero36) block parsing
  // 1 column, 3 rows: header, image, text

  // Header row
  const headerRow = ['Hero (hero36)'];

  // Find logo image (background image for hero)
  const logoDiv = element.querySelector('.cmp-product-list__logo');
  let logoImg = logoDiv && logoDiv.querySelector('img');

  // Row 2: image (logo)
  const imageRow = [logoImg ? logoImg : ''];

  // Find heading and description
  const headingDiv = element.querySelector('.cmp-product-list__heading');
  let heading = headingDiv && headingDiv.querySelector('h2');
  let description = headingDiv && headingDiv.querySelector('p');
  // Compose text cell
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  const textRow = [textCell];

  // Assemble table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}