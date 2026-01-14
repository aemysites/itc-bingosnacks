/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel18) block
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Find the swiper wrapper containing slides
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Each .swiper-slide is a carousel item
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');

  slides.forEach((slide) => {
    // Find the image (mandatory)
    let img = slide.querySelector('img');
    if (!img) return; // skip if no image

    // Only the image in the first cell
    // Second cell: extract text content if present (in this case, none, so leave blank)
    const row = [img];
    // Check for text content (for this carousel, there is none in the HTML, so cell is blank)
    row.push('');
    rows.push(row);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
