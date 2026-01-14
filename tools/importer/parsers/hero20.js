/* global WebImporter */
export default function parse(element, { document }) {
  // Extract hero image
  const heroImg = element.querySelector('.cmp-teaser__image img');

  // Extract headline (Always a New Flavour...)
  let headingContent = '';
  const textBlock = element.querySelector('.text .cmp-text');
  if (textBlock) {
    textBlock.querySelectorAll('p').forEach(p => {
      if (!p.textContent.trim()) p.remove();
    });
    headingContent = textBlock.cloneNode(true);
  }

  // Attempt to extract all visible text from the hero area (including overlay text)
  let heroOverlayText = '';
  const teaserArea = element.querySelector('.cmp-teaser--full-bg-text-center-image-bottom-button');
  if (teaserArea) {
    // Get all text nodes inside teaser area
    const walker = document.createTreeWalker(teaserArea, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    let node;
    let overlayTexts = [];
    while ((node = walker.nextNode())) {
      overlayTexts.push(node.textContent.trim());
    }
    heroOverlayText = overlayTexts.join(' ');
  }

  // Compose overlay block (all hero text in one cell)
  const overlayBlock = document.createElement('div');
  if (heroOverlayText) {
    overlayBlock.appendChild(document.createTextNode(heroOverlayText));
    overlayBlock.appendChild(document.createElement('br'));
  }
  if (headingContent) {
    overlayBlock.appendChild(headingContent);
  }

  // Compose table rows (single column per row)
  const rows = [
    ['Hero (hero20)'],
    [heroImg ? heroImg : ''],
    [overlayBlock],
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
