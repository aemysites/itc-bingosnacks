/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero17)'];

  // 2. Extract the main hero image (background image)
  const img = element.querySelector('.cmp-teaser__image img');
  let imageRow = [''];
  if (img) {
    imageRow = [img];
  }

  // 3. Extract all visible text content from the hero area
  // The HTML does not contain any visible text nodes for branding, heading, or subheading.
  // Do NOT invent or infer text; leave the text row empty as per requirements.
  const textRow = [''];

  // 4. Build the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
