/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards37) block parsing
  // 1. Find the cards container
  const cardsContainer = element.querySelector('.cards');
  if (!cardsContainer) return;

  // 2. Find all card elements (each is an <a> containing .cmp-card__content)
  const cardLinks = Array.from(cardsContainer.querySelectorAll('a'));
  if (!cardLinks.length) return;

  // 3. Prepare the table header
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // 4. For each card, extract image and text
  cardLinks.forEach((a) => {
    // Image: find <img> inside the card
    const img = a.querySelector('img');
    // Text: find <h4> inside the card
    const text = a.querySelector('h4');
    // Compose the row: [image, text]
    const imgCell = img ? img : '';
    const textCell = text ? text : '';
    rows.push([imgCell, textCell]);
  });

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(block);
}
