/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Select all card links (each card is an <a> with class cmp-product-list__link)
  const cardLinks = element.querySelectorAll('.cmp-product-list__link');

  cardLinks.forEach((cardLink) => {
    // --- IMAGE CELL ---
    // Find the first image in the card (desktop version)
    const imageContainer = cardLink.querySelector('.cmp-product-list__content--image');
    let imageEl = null;
    if (imageContainer) {
      // Prefer the first <img> in the first <picture>
      const picture = imageContainer.querySelector('picture');
      if (picture) {
        imageEl = picture.querySelector('img');
      }
    }

    // --- TEXT CELL ---
    const details = cardLink.querySelector('.cmp-product-list__details');
    let titleText = '';
    let descriptionEl = null;
    // Title: Extract from the alt attribute (the visible card title in the screenshot)
    if (imageEl) {
      // The alt attribute contains the visible flavor name (e.g., 'Hashtag Spicy Masala - Bingo Snacks')
      // Extract the flavor name before the ' - ' separator and preserve ampersand
      const alt = imageEl.getAttribute('alt') || '';
      const match = alt.match(/Hashtag ([^\-]+) -/);
      if (match && match[1]) {
        // Preserve ampersand as in the alt text
        titleText = match[1].trim().toUpperCase();
      }
    }
    // Description: from <p> inside details
    if (details) {
      descriptionEl = details.querySelector('.cmp-product-list__details-description');
    }

    // Compose the text cell
    const textCell = [];
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      textCell.push(h3);
    }
    if (descriptionEl) {
      textCell.push(descriptionEl);
    }
    // Do NOT add CTA/link unless it is visually present (not in this screenshot)

    rows.push([
      imageEl || '',
      textCell,
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
