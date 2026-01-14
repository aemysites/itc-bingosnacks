/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active carousel item
  const carouselContent = element.querySelector('.cmp-carousel__content');
  let activeItem = carouselContent ? carouselContent.querySelector('.cmp-carousel__item--active') : null;
  if (!activeItem) {
    activeItem = element.querySelector('.cmp-carousel__item');
  }

  // Find the teaser inside the active carousel item
  const teaser = activeItem ? activeItem.querySelector('.cmp-teaser') : null;

  // --- Row 2: Background Image ---
  let heroImg = '';
  if (teaser) {
    const img = teaser.querySelector('img');
    if (img) heroImg = img;
  }

  // --- Row 3: Text Content ---
  // Try to extract all text content from the teaser area, including alt text and aria-labels
  let textContent = [];
  if (teaser) {
    // Extract aria-label from carousel item (may contain slide label)
    if (activeItem && activeItem.getAttribute('aria-label')) {
      const label = activeItem.getAttribute('aria-label').trim();
      if (label) {
        const h2 = document.createElement('h2');
        h2.textContent = label;
        textContent.push(h2);
      }
    }
    // Extract alt text from image if present
    if (heroImg && heroImg.alt && heroImg.alt.trim()) {
      const p = document.createElement('p');
      p.textContent = heroImg.alt.trim();
      textContent.push(p);
    }
  }

  // If nothing found, fallback to alt text only
  if (textContent.length === 0 && heroImg && heroImg.alt && heroImg.alt.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = heroImg.alt.trim();
    textContent.push(h2);
  }

  // --- Build Table ---
  const rows = [
    ['Hero (hero47)'],
    [heroImg ? heroImg : ''],
    [textContent.length ? textContent : '']
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
