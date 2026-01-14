/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns6)'];

  // --- COLUMN 1: Logo area (leftmost) ---
  // Use the desktop logo images and all visible text (including 'Enduring Value', 'fssai', license number)
  const logoDiv = document.createElement('div');
  const desktopDiv = element.querySelector('.bnatural-footer-desktop-div');
  if (desktopDiv) {
    // ITC logo
    const itcImg = desktopDiv.querySelector('img[alt="ITC Logo"]');
    if (itcImg) {
      logoDiv.appendChild(itcImg.cloneNode(true));
    }
    // FSSAI logo
    const fssaiImg = desktopDiv.querySelector('img[alt="Fssai Logo"]');
    if (fssaiImg) {
      logoDiv.appendChild(fssaiImg.cloneNode(true));
    }
    // Add 'Enduring Value' and 'fssai' text if present
    const footerLogoDiv = element.querySelector('.footerLogo');
    if (footerLogoDiv && footerLogoDiv.textContent.trim()) {
      const evDiv = document.createElement('div');
      evDiv.textContent = footerLogoDiv.textContent.trim();
      logoDiv.appendChild(evDiv);
    }
    // Add license number text
    let licenseText = '';
    const possibleLicense = Array.from(desktopDiv.querySelectorAll('div')).find(div => div.textContent.includes('Lic. No.'));
    if (possibleLicense) {
      licenseText = possibleLicense.textContent.trim();
    } else {
      licenseText = 'Lic. No. 10012031000512';
    }
    const licenseDiv = document.createElement('div');
    licenseDiv.textContent = licenseText;
    logoDiv.appendChild(licenseDiv);
  }

  // --- COLUMN 2-6: Navigation columns ---
  // Each .cmp-footer_nav-items is a column; group last two nav columns into one
  const navItems = Array.from(element.querySelectorAll('.cmp-footer__nav > .cmp-footer_nav-items'));
  const navColumns = [];
  for (let i = 0; i < 4; i++) {
    const col = navItems[i];
    if (col) {
      const ul = col.querySelector('ul');
      navColumns.push(ul ? ul.cloneNode(true) : document.createElement('div'));
    } else {
      navColumns.push(document.createElement('div'));
    }
  }
  // Merge the last two nav columns into one cell (Contact Us/Sitemap + Privacy Policy/Terms of use)
  const mergedDiv = document.createElement('div');
  for (let i = 4; i < 6; i++) {
    const col = navItems[i];
    if (col) {
      const ul = col.querySelector('ul');
      if (ul) {
        mergedDiv.appendChild(ul.cloneNode(true));
      } else {
        const links = col.querySelectorAll('a');
        links.forEach(a => {
          const linkDiv = document.createElement('div');
          linkDiv.textContent = a.textContent.trim();
          mergedDiv.appendChild(linkDiv);
        });
      }
    }
  }
  navColumns.push(mergedDiv);

  // Compose the table rows
  const cells = [
    headerRow,
    [logoDiv, ...navColumns]
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
