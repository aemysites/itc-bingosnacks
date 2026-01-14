/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cards41)'];

  // Extract the intro section: logo, heading, description
  const info = element.querySelector('.cmp-product-list__information');
  let introCell = document.createElement('div');
  if (info) {
    // Logo
    const logoImg = info.querySelector('.cmp-product-list__logo img');
    if (logoImg) introCell.appendChild(logoImg.cloneNode(true));
    // Heading
    const heading = info.querySelector('.cmp-product-list__heading h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      introCell.appendChild(h2);
    }
    // Description
    const desc = info.querySelector('.cmp-product-list__heading .cmp-product-list__description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      introCell.appendChild(p);
    }
  }

  // Find the container holding all card links
  const cardsContainer = element.querySelector('.cmp-product-list__container');
  if (!cardsContainer) return;

  // Collect all card links (each card is an <a> with class 'cmp-product-list__link')
  const cardLinks = cardsContainer.querySelectorAll('.cmp-product-list__link');

  const cardRows = Array.from(cardLinks).map(link => {
    // Card image: use the first <img> inside the card (do not clone, reference directly)
    const img = link.querySelector('.cmp-product-list__content--image img');

    // Card details (title and description)
    const details = link.querySelector('.cmp-product-list__details');
    let title = '', desc = '';
    if (details) {
      // Title: Use the product name from the image alt attribute, removing trailing branding
      if (img && img.getAttribute('alt')) {
        // Extract just the product name (e.g., 'Bhavnagari Gathiya', 'Papdi Gathiya')
        const match = img.getAttribute('alt').match(/(Bhavnagari Gathiya|Papdi Gathiya)/i);
        if (match) title = match[1].toUpperCase();
      }
      // Description: Use the details description paragraph
      const descEl = details.querySelector('.cmp-product-list__details-description');
      if (descEl) desc = descEl.textContent.trim();
    }
    // Compose the text cell
    const textCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title;
      textCell.appendChild(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      textCell.appendChild(p);
    }
    // Add CTA (link) if present
    if (link.href) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = 'Learn more';
      textCell.appendChild(cta);
    }
    return [img, textCell];
  });

  // Build the table: header, intro row, card rows
  const tableRows = [headerRow, [introCell], ...cardRows];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
