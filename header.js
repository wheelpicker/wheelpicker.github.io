// header.js
(function renderHeader() {
  const links = [
    { label: 'Spinner', href: '#spinner-app' },
    { label: 'Types', href: '#wheel-types' },
    { label: 'Features', href: '#features' },
    { label: 'FAQ', href: '#faq' },
  ];
  
  const nav = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  
  // Create header HTML
  const headerHTML = `
    <a href="/" class="logo">
      <div class="logo-icon"></div>
      <span>Wheel</span>Picker
    </a>
    <nav>${nav}<a href="#spinner-app" class="nav-cta">Spin Now</a></nav>
    <button class="hamburger" id="hamburgerBtn" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>`;
  
  // Set header content
  const headerElement = document.getElementById('site-header');
  if (headerElement) {
    headerElement.innerHTML = headerHTML;
  }
  
  // Create mobile navigation
  const mobileLinks = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  const mobileNavHTML = mobileLinks + `<a href="#spinner-app" class="btn-primary">Spin Now</a>`;
  
  const mobileNavElement = document.getElementById('mobileNav');
  if (mobileNavElement) {
    mobileNavElement.innerHTML = mobileNavHTML;
  }
  
  // Add hamburger menu functionality
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const mobileNav = document.getElementById('mobileNav');
      if (mobileNav) mobileNav.classList.toggle('open');
    });
  }
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('#mobileNav a').forEach(a => {
    a.addEventListener('click', () => {
      const mobileNav = document.getElementById('mobileNav');
      if (mobileNav) mobileNav.classList.remove('open');
    });
  });
})();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderHeader };
}
