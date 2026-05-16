// footer.js
(function renderFooter() {
  const footerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo"><div class="logo-icon"></div><span>Wheel</span>Picker</div>
        <p>The free online random wheel spinner trusted by teachers, streamers, and decision-makers worldwide.</p>
      </div>
      <div class="footer-col">
        <h4>Wheels</h4>
        <ul>
          <li><a href="/#spinner-app">Name Picker Wheel</a></li>
          <li><a href="/#spinner-app">Yes/No Wheel</a></li>
          <li><a href="/#spinner-app">Number Wheel</a></li>
          <li><a href="/#spinner-app">Colour Wheel</a></li>
          <li><a href="/#spinner-app">Custom Wheel</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Features</h4>
        <ul>
          <li><a href="/#features">Sound Effects</a></li>
          <li><a href="/#features">Result History</a></li>
          <li><a href="/#features">Full Screen</a></li>
          <li><a href="/#features">Share Wheel</a></li>
          <li><a href="/#features">Mobile App</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Info</h4>
        <ul>
          <li><a href="/#how-it-works">How It Works</a></li>
          <li><a href="/#use-cases">Use Cases</a></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="/#seo-content">About</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} WheelPicker · wheelpicker.github.io · All rights reserved.</p>
      <div class="footer-links">
        <a href="privacy">Privacy</a>
        <a href="terms">Terms</a>
        <a href="contact">Contact</a>
        <a href="about">About</a>
      </div>
    </div>`;
  
  const footerElement = document.getElementById('site-footer');
  if (footerElement) {
    footerElement.innerHTML = footerHTML;
  }
})();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderFooter };
}
