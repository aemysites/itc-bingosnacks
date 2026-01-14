/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Hero (hero19)'];

  // --- Extract the image (row 2) ---
  // Find the main hero image (background/decorative)
  let heroImage = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    // Look for <img> inside <picture>
    const img = imageDiv.querySelector('img');
    if (img) {
      heroImage = img;
    }
  }

  // --- Extract the text content (row 3) ---
  // Find the content area
  let textContent = null;
  const contentDiv = element.querySelector('.cmp-teaser__description');
  if (contentDiv) {
    // Clone the content to avoid removing it from the original DOM
    textContent = document.createElement('div');
    // Only keep h1, h2, h3, p, a, button (if present)
    // (The example only has h1 and p)
    contentDiv.childNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        ['H1', 'H2', 'H3', 'P', 'A', 'BUTTON'].includes(node.tagName)
      ) {
        textContent.appendChild(node.cloneNode(true));
      }
    });
  }

  // --- Build the table ---
  const rows = [
    headerRow,
    [heroImage ? heroImage : ''],
    [textContent ? textContent : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
