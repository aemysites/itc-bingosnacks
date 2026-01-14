/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get first <img> in the card
  function getCardImage(card) {
    return card.querySelector('img');
  }

  // Helper: get card title from image alt/title or link data-title
  function getCardTitle(card, link) {
    // Try to get from link data-title
    if (link && link.dataset.title) {
      // Extract after 'Tedhe Medhe' or 'Tedhe Medhe '
      const match = link.dataset.title.match(/Tedhe Medhe\s*([^|\-]+)/i);
      if (match) {
        // Only use the last word(s) after Tedhe Medhe, matching screenshot
        return match[1].trim().split(/\s+/).slice(-2).join(' ').toUpperCase();
      }
    }
    // Try to get from image alt/title
    const img = getCardImage(card);
    if (img) {
      let alt = img.getAttribute('alt') || img.getAttribute('title') || '';
      const match = alt.match(/Tedhe Medhe\s*([A-Za-z ]+)/i);
      if (match) {
        return match[1].trim().split(/\s+/).slice(-2).join(' ').toUpperCase();
      }
    }
    return '';
  }

  // Helper: get description node
  function getCardDescription(card) {
    const desc = card.querySelector('.cmp-product-list__details-description');
    if (!desc) return document.createElement('span');
    const p = document.createElement('p');
    p.textContent = desc.textContent;
    return p;
  }

  // Helper: build text cell (title as heading, then description, then CTA if present)
  function buildCardTextCell(card, link) {
    const title = getCardTitle(card, link);
    const desc = getCardDescription(card);
    const heading = document.createElement('h2');
    heading.textContent = title;
    const wrapper = document.createElement('div');
    wrapper.appendChild(heading);
    wrapper.appendChild(desc);
    // Add CTA if link exists
    if (link && link.href) {
      const cta = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.href;
      cta.appendChild(a);
      wrapper.appendChild(cta);
    }
    return wrapper;
  }

  // Find all card links
  const cardLinks = element.querySelectorAll('.cmp-product-list__link');
  const rows = [];
  rows.push(['Cards (cards8)']);
  cardLinks.forEach(link => {
    const card = link.querySelector('.cmp-product-list__content');
    if (!card) return;
    const img = getCardImage(card);
    const textCell = buildCardTextCell(card, link);
    rows.push([img, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
