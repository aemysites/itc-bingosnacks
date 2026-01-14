/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns5)'];

  // Find the main content containers
  const content = element.querySelector('.cmp-teaser__content');
  const image = element.querySelector('.cmp-teaser__image');
  const smallImage = element.querySelector('.cmp-animation');

  // Compose left column: image(s) and any visible text nodes
  let leftCol = document.createElement('div');
  if (image) {
    leftCol.appendChild(image.cloneNode(true));
    // Extract any visible text nodes inside the image column
    // (callout text like 'EAT. PHIR REPEAT.' if present in HTML)
    Array.from(image.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        leftCol.appendChild(p);
      }
      // Also check for direct child elements with visible text
      if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        leftCol.appendChild(p);
      }
    });
  }
  if (smallImage) leftCol.appendChild(smallImage.cloneNode(true));

  // Compose right column: heading and paragraph
  let rightCol = document.createElement('div');
  if (content) {
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) rightCol.append(...desc.childNodes);
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCol, rightCol],
  ], document);

  element.replaceWith(table);
}
