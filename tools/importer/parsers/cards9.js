/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all images from a teaser block (main + animation)
  function getImages(teaser) {
    const images = [];
    // Main image
    const mainImg = teaser.querySelector('.cmp-teaser__image picture img.cmp-image__image');
    if (mainImg) images.push(mainImg.cloneNode(true));
    // Animation image
    const animImg = teaser.querySelector('.cmp-teaser__image .cmp-animation picture img');
    if (animImg) images.push(animImg.cloneNode(true));
    // If more than one image, wrap in a div
    if (images.length === 1) return images[0];
    if (images.length > 1) {
      const div = document.createElement('div');
      images.forEach(img => div.appendChild(img));
      return div;
    }
    return null;
  }

  // Helper to extract the text content (title and description) from a teaser block
  function getTextContent(teaser) {
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (!desc) return null;
    return desc.cloneNode(true);
  }

  // Find the main cards container
  const cardsContainer = element.querySelector('.cmp-our-story');
  if (!cardsContainer) return;

  // Find all story teasers that have content
  const cardTeasers = Array.from(cardsContainer.querySelectorAll('.teaser')).filter(teaser => {
    return (
      teaser.querySelector('.cmp-teaser__image picture img.cmp-image__image') &&
      teaser.querySelector('.cmp-teaser__description')
    );
  });

  // Build the table rows
  const rows = [
    ['Cards (cards9)'],
  ];

  cardTeasers.forEach(teaser => {
    const images = getImages(teaser);
    const textContent = getTextContent(teaser);
    if (images && textContent) {
      rows.push([
        images,
        textContent
      ]);
    }
  });

  // --- Bottom section: headline and product images ---
  // Find the headline containing 'SO MANY WAYS TO'
  let bottomHeadline = null;
  const possibleHeadlines = Array.from(element.querySelectorAll('h1, h2, h3, h4'));
  bottomHeadline = possibleHeadlines.find(h => h.textContent.trim().toUpperCase().includes('SO MANY WAYS TO'));

  // Find the row of product images (chips packs)
  // Only include images that appear after the headline in the DOM
  let productImages = [];
  if (bottomHeadline) {
    let next = bottomHeadline.nextElementSibling;
    while (next) {
      if (next.tagName === 'IMG') {
        productImages.push(next.cloneNode(true));
      } else {
        productImages.push(...Array.from(next.querySelectorAll('img')).map(img => img.cloneNode(true)));
      }
      next = next.nextElementSibling;
    }
  }

  if (bottomHeadline && productImages.length) {
    const imgDiv = document.createElement('div');
    productImages.forEach(img => imgDiv.appendChild(img));
    rows.push([
      imgDiv,
      bottomHeadline.cloneNode(true)
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
