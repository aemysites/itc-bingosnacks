/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero11)
  const headerRow = ['Hero (hero11)'];

  // --- Get the hero background image (the decorative background) ---
  let bgImage = null;
  const bgImgEl = element.querySelector('.cmp-teaser__image img');
  if (bgImgEl) {
    bgImage = bgImgEl.cloneNode(true);
  }

  // --- Get the logo graphic (Bingo! Mad Angles) ---
  let logoText = null;
  const logoTextEl = element.querySelector('.cmp-teaser__description h2');
  if (logoTextEl) {
    const logoClone = logoTextEl.cloneNode(true);
    logoClone.querySelectorAll('br').forEach(br => br.remove());
    logoText = logoClone;
  }

  // --- Get the hero text content (description/subheading) ---
  let description = null;
  const teaserDesc = element.querySelector('.cmp-teaser__description p');
  if (teaserDesc) {
    description = teaserDesc.cloneNode(true);
  }

  // --- Get the main heading below the hero ---
  let heading = null;
  const headingEl = element.querySelector('.cmp-text h1');
  if (headingEl) {
    const headingClone = headingEl.cloneNode(true);
    headingClone.querySelectorAll('br').forEach(br => br.remove());
    headingClone.innerHTML = headingClone.innerHTML.replace(/&nbsp;/g, '');
    heading = headingClone;
  }

  // Compose the text cell (logo, description, heading)
  const textCellContent = [];
  if (logoText) textCellContent.push(logoText);
  if (description) textCellContent.push(description);
  if (heading) textCellContent.push(heading);

  // --- Build the table ---
  const rows = [
    headerRow,
    [bgImage ? bgImage : ''],
    [textCellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
