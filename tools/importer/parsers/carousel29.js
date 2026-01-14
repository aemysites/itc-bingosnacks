/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel29) block
  // 2 columns: [Image, Optional Text]
  // Header row: ['Carousel (carousel29)']

  const headerRow = ['Carousel (carousel29)'];
  const rows = [headerRow];

  // Find all carousel items
  const items = Array.from(element.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));

  items.forEach((item) => {
    // Find image element (mandatory)
    const img = item.querySelector('img');
    let imgEl = null;
    if (img) {
      imgEl = img;
    }
    // Find all visible text overlays within the slide (including nested)
    // Only include elements with non-empty text and not part of image wrappers
    // Fix: Select all elements with text, but exclude image wrappers and navigation/indicator elements
    const textBlocks = Array.from(item.querySelectorAll('*')).filter(el => {
      // Exclude image wrappers and navigation/indicator elements
      if (el.closest('.image')) return false;
      if (el.classList.contains('cmp-carousel__actions') || el.classList.contains('cmp-carousel__indicators')) return false;
      return el.textContent.trim().length > 0;
    });
    let textContent = '';
    if (textBlocks.length > 0) {
      const wrapper = document.createElement('div');
      textBlocks.forEach(tb => wrapper.appendChild(tb.cloneNode(true)));
      textContent = wrapper;
    }
    rows.push([imgEl, textContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
