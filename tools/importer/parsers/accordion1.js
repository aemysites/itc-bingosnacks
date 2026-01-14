/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row - must be single cell
  const headerRow = ['Accordion (accordion1)'];
  const rows = [headerRow];

  // Find all accordion items within this accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title: find the button with the title span
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }

    // Content: find the panel and grab its content
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Collect all direct children that are not script/style
      const contentNodes = [];
      panel.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
          contentNodes.push(node);
        }
      });
      // If no element nodes, fallback to text
      if (contentNodes.length > 0) {
        content = contentNodes;
      } else {
        content = panel.textContent.trim();
      }
    }

    rows.push([title, content]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
