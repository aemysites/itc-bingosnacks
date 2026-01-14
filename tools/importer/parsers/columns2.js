/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name as header
  const headerRow = ['Columns (columns2)'];

  // Find the main cmp-teaser__content and cmp-teaser__image
  const content = element.querySelector('.cmp-teaser__content');
  const image = element.querySelector('.cmp-teaser__image');

  // Compose the text cell: use the cmp-teaser__description
  let textCell = null;
  if (content) {
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      textCell = desc;
    }
  }

  // Compose the image cell: use only the main image block
  let imageCell = null;
  if (image) {
    imageCell = image;
  }

  // Determine order: left/right image alignment
  let row;
  if (element.classList.contains('cmp-teaser--right-image-aligned')) {
    // Text left, image right
    row = [textCell, imageCell];
  } else {
    // Image left, text right
    row = [imageCell, textCell];
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);
  // Replace the original element
  element.replaceWith(table);
}
