/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header
  const headerRow = ['Carousel (carousel31)'];
  const rows = [headerRow];

  // Find all carousel items/slides
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const slides = carouselContent.querySelectorAll('.cmp-carousel__item');

  // Extract main heading text from the carousel (e.g., 'Bingo!', 'ORIGINAL POTATO CHIPS STYLE')
  // These are outside the slides, so grab them from the parent carousel element
  let mainHeading = '';
  // Try to find the logo alt text
  const logoImg = element.querySelector('img[alt*="Bingo"]');
  if (logoImg && logoImg.alt) {
    mainHeading += logoImg.alt.trim() + ' ';
  }
  // Try to find large heading text (e.g., 'ORIGINAL POTATO CHIPS STYLE')
  // Use less specific selectors to capture more text
  const headingText = Array.from(element.querySelectorAll('span, div, h1, h2, h3'))
    .map(el => el.textContent.trim())
    .filter(t => t.length > 0 && /ORIGINAL.*STYLE/i.test(t));
  if (headingText.length) {
    mainHeading += headingText[0];
  }
  mainHeading = mainHeading.trim();

  slides.forEach((slide, idx) => {
    // Find the image (mandatory)
    let img = null;
    const imgContainer = slide.querySelector('.cmp-teaser__image img');
    if (imgContainer) {
      img = imgContainer;
    }

    // Build the text content cell
    const textCell = document.createElement('div');
    // For the first slide, add the main heading text if found
    if (idx === 0 && mainHeading) {
      const headingEl = document.createElement('h2');
      headingEl.textContent = mainHeading;
      textCell.appendChild(headingEl);
    }
    // Try to find description text (from .cmp-teaser__description)
    const desc = slide.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.querySelectorAll('p')).forEach(p => {
        const txt = p.textContent.replace(/\u00a0/g, '').trim();
        if (txt) {
          const pEl = document.createElement('p');
          pEl.textContent = txt;
          textCell.appendChild(pEl);
        }
      });
    }
    // Try to find a CTA link
    const cta = slide.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCell.appendChild(cta.cloneNode(true));
    }
    rows.push([img, textCell.childNodes.length ? textCell : '']);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
