/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for Hero block
  const headerRow = ['Hero (hero38)'];

  // 2. Find the image (background/product image)
  let imageEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // 3. Only extract the main description text (no duplication, no merging)
  let textCell = '';
  const descriptionEl = element.querySelector('.cmp-teaser__description');
  if (descriptionEl) {
    textCell = descriptionEl.cloneNode(true);
  } else {
    // fallback to all text content if description missing
    const fallbackText = element.textContent.trim();
    if (fallbackText) {
      const div = document.createElement('div');
      div.textContent = fallbackText;
      textCell = div;
    }
  }

  // 4. Build the table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textCell]
  ];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(block);
}
