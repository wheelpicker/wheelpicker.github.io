(function () {
  var headerHTML = ''
    + '<header class="site-header">'
    + '  <div class="container">'
    + '    <a href="/" class="brand"><span class="brand-mark" aria-hidden="true"></span>Color Wheel Picker</a>'
    + '    <nav aria-label="Primary">'
    + '      <ul class="site-nav" id="siteNav">'
    + '        <li><a href="#wheel-tool">Color Wheel</a></li>'
    + '        <li><a href="#wheel-network">All Wheels</a></li>'
    + '        <li><a href="#features">Features</a></li>'
    + '        <li><a href="#use-cases">Use Cases</a></li>'
    + '        <li><a href="#faq">FAQ</a></li>'
    + '      </ul>'
    + '    </nav>'
    + '    <div class="header-actions">'
    + '      <a href="#wheel-network" class="btn btn-ghost" style="padding:10px 18px;font-size:.85rem;">Spin a wheel</a>'
    + '      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="siteNav" aria-label="Toggle menu">&#9776;</button>'
    + '    </div>'
    + '  </div>'
    + '</header>';

  var mount = document.getElementById('header');
  if (mount) {
    mount.innerHTML = headerHTML;

    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
})();
