/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Table Header ---
  const headerRow = ['Hero (hero14)'];

  // --- 2. Background Image (row 2) ---
  let heroImg = null;
  const carouselImg = element.querySelector('.cmp-carousel__item img');
  if (carouselImg) heroImg = carouselImg;

  // --- 3. Text Content (row 3) ---
  // Gather all visible text from .cmp-teaser (logo, product name, variant, offer)
  const contentFrag = document.createDocumentFragment();
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    // Find all elements with direct text content (not empty, not whitespace)
    teaser.querySelectorAll('*').forEach((el) => {
      const txt = el.textContent.trim();
      // Only add if not already present and not empty
      if (txt && !contentFrag.textContent.includes(txt)) {
        // Use <h2> for logo/product name and variant, <p> for offers
        if (/tedhe medhe|bingo/i.test(txt) || /masala tadka/i.test(txt)) {
          const h2 = document.createElement('h2');
          h2.textContent = txt;
          contentFrag.appendChild(h2);
        } else {
          const p = document.createElement('p');
          p.textContent = txt;
          contentFrag.appendChild(p);
        }
      }
    });
  }

  // Add the main headline from .cmp-text
  const textDiv = element.querySelector('.text .cmp-text');
  if (textDiv) {
    const h1 = textDiv.querySelector('h1');
    if (h1 && h1.textContent.trim()) {
      const heading = document.createElement('h1');
      heading.textContent = h1.textContent.replace(/\s+/g, ' ').trim();
      contentFrag.appendChild(heading);
    }
  }

  // --- 4. Table Construction ---
  const cells = [
    headerRow,
    [heroImg ? heroImg : ''],
    [contentFrag],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
