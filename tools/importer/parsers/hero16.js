/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match block name exactly
  const headerRow = ['Hero (hero16)'];

  // 2. Background image: Use the first <img> in the main teaser block (not the product cluster)
  let bgImg = null;
  const teaserDiv = element.querySelector('.cmp-teaser');
  if (teaserDiv) {
    const teaserImg = teaserDiv.querySelector('img');
    if (teaserImg) {
      bgImg = teaserImg;
    }
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row: Extract heading, subheading, paragraph, CTA (link), and product image cluster
  const contentParts = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title (h3)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Subheading (h2)
    const descDiv = contentDiv.querySelector('.cmp-teaser__description');
    if (descDiv) {
      const subheading = descDiv.querySelector('h2');
      if (subheading) contentParts.push(subheading);
      // Paragraph
      const para = descDiv.querySelector('p');
      if (para) contentParts.push(para);
    }
    // CTA (link)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }
  // Product image cluster: extract the main product image only (not the wrapping div)
  const productImg = element.querySelector('.cmp-teaser__image img');
  if (productImg) contentParts.push(productImg);

  // Add headline text from HTML if present (not from screenshot analysis)
  // Check for headline text nodes directly under .cmp-teaser or its children
  const possibleHeadlines = element.querySelectorAll('.cmp-teaser > *');
  possibleHeadlines.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      contentParts.unshift(document.createTextNode(child.textContent.trim()));
    }
  });

  const contentRow = [contentParts];

  // 4. Create table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
