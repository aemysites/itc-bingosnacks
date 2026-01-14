/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extracts card content from an <a> card anchor
  function extractCard(cardAnchor) {
    const cardContent = cardAnchor.querySelector('.cmp-card__content');
    if (!cardContent) return null;

    // --- IMAGE CELL ---
    // Only the main product image (large visual) and the brand logo (top left)
    const imageCell = [];
    // Brand logo image (top left)
    const logoImg = cardContent.querySelector('.cmp-card__logo');
    let logoPicture = logoImg ? logoImg.closest('picture') : null;
    if (logoPicture) imageCell.push(logoPicture);
    // Main product image (large visual)
    const productImg = cardContent.querySelector('.cmp-card__media img');
    let productPicture = productImg ? productImg.closest('picture') : null;
    if (productPicture) imageCell.push(productPicture);

    // --- TEXT CELL ---
    // Title and handle
    const titleDiv = cardContent.querySelector('.cmp-card__title');
    let title = null;
    let handle = null;
    if (titleDiv) {
      title = titleDiv.querySelector('h3');
      handle = titleDiv.querySelector('p');
    }
    // Description
    const descDiv = cardContent.querySelector('.cmp-card__description');
    const desc = descDiv ? descDiv.querySelector('p') : null;
    // CTA Button
    const btnText = cardContent.querySelector('.cmp-button__text');
    let cta = null;
    if (btnText) {
      cta = document.createElement('a');
      cta.href = cardAnchor.getAttribute('href');
      cta.textContent = btnText.textContent;
    }
    // Compose text cell: title, handle, description, CTA
    const textCell = [];
    if (title) textCell.push(title);
    if (handle) textCell.push(handle);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    return [imageCell, textCell];
  }

  // Find all card anchors (each card is an <a>...)
  const cardAnchors = element.querySelectorAll('.cmp-card__container > a');
  const rows = [
    ['Cards (cards23)'],
  ];
  cardAnchors.forEach((cardAnchor) => {
    const cardRow = extractCard(cardAnchor);
    if (cardRow) rows.push(cardRow);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
