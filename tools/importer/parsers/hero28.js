/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Hero (hero28)'];

  // There is never a background image in the provided HTML/screenshots
  const backgroundRow = [''];

  // Find the inner cmp-text div (should be only one)
  const cmpText = element.querySelector('.cmp-text');

  let contentRow;
  if (cmpText) {
    // Collect all direct children of cmp-text
    const children = Array.from(cmpText.childNodes);
    // If there are children, preserve all of them (including empty paragraphs)
    if (children.length > 0) {
      const preserved = children.map((child) => {
        // If it's an element, clone it
        if (child.nodeType === 1) {
          return child.cloneNode(true);
        }
        // If it's a text node, preserve as text
        if (child.nodeType === 3 && child.textContent.trim()) {
          return document.createTextNode(child.textContent);
        }
        return null;
      }).filter(Boolean);
      contentRow = [preserved];
    } else {
      // If no children, fallback to textContent
      contentRow = [cmpText.textContent];
    }
  } else {
    contentRow = [''];
  }

  const rows = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
