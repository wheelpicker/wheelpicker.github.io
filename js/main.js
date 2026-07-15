(function () {
  'use strict';

  /* ---------- helpers: color conversion ---------- */
  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    var k = function (n) { return (n + h / 30) % 12; };
    var a = s * Math.min(l, 1 - l);
    var f = function (n) {
      return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    };
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4))
    ];
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      var h = v.toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  }

  /* ---------- color wheel canvas ---------- */
  var canvas = document.getElementById('colorWheel');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var size = canvas.width;
  var radius = size / 2;
  var pointerEl = document.getElementById('wheelPointer');
  var lightRange = document.getElementById('lightRange');
  var hexEl = document.getElementById('hexValue');
  var rgbEl = document.getElementById('rgbValue');
  var hslEl = document.getElementById('hslValue');
  var toastEl = document.getElementById('copyToast');
  var paletteEl = document.getElementById('miniPalette');
  var spinBtn = document.getElementById('spinColorBtn');
  var saveBtn = document.getElementById('savePaletteBtn');

  var current = { h: 262, s: 84, l: 58 };

  function drawWheel() {
    var img = ctx.createImageData(size, size);
    var data = img.data;
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var dx = x - radius;
        var dy = y - radius;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var idx = (y * size + x) * 4;
        if (dist <= radius) {
          var angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;
          var sat = Math.min(dist / radius, 1) * 100;
          var rgb = hslToRgb(angle, sat, 50);
          data[idx] = rgb[0];
          data[idx + 1] = rgb[1];
          data[idx + 2] = rgb[2];
          data[idx + 3] = 255;
        } else {
          data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function updateReadout() {
    var rgb = hslToRgb(current.h, current.s, current.l);
    var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    hexEl.textContent = hex.toUpperCase();
    rgbEl.textContent = rgb[0] + ', ' + rgb[1] + ', ' + rgb[2];
    hslEl.textContent = Math.round(current.h) + '\u00B0, ' + Math.round(current.s) + '%, ' + Math.round(current.l) + '%';

    var angleRad = (current.h * Math.PI) / 180;
    var distRatio = current.s / 100;
    var px = radius + Math.cos(angleRad) * distRatio * radius;
    var py = radius + Math.sin(angleRad) * distRatio * radius;
    var pct = size ? (100 / size) : 0;
    pointerEl.style.left = (px * pct) + '%';
    pointerEl.style.top = (py * pct) + '%';
    pointerEl.style.background = hex;
  }

  function setFromEvent(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = size / rect.width;
    var scaleY = size / rect.height;
    var x = (clientX - rect.left) * scaleX;
    var y = (clientY - rect.top) * scaleY;
    var dx = x - radius;
    var dy = y - radius;
    var dist = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
    var angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    current.h = angle;
    current.s = (dist / radius) * 100;
    updateReadout();
  }

  var dragging = false;
  canvas.addEventListener('pointerdown', function (e) {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    setFromEvent(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (dragging) setFromEvent(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointerup', function () { dragging = false; });
  canvas.addEventListener('pointercancel', function () { dragging = false; });

  lightRange.addEventListener('input', function () {
    current.l = Number(lightRange.value);
    updateReadout();
  });

  /* ---------- spin for random color ---------- */
  spinBtn.addEventListener('click', function () {
    var targetH = Math.random() * 360;
    var targetS = 40 + Math.random() * 60;
    var startH = current.h;
    var startS = current.s;
    var duration = 900;
    var startTime = null;

    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function step(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      var t = Math.min(elapsed / duration, 1);
      var e = ease(t);
      current.h = startH + (targetH - startH + 720) * e % 360;
      current.s = startS + (targetS - startS) * e;
      updateReadout();
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        current.h = targetH;
        current.s = targetS;
        updateReadout();
      }
    }
    requestAnimationFrame(step);
  });

  /* ---------- copy to clipboard ---------- */
  document.querySelectorAll('.swatch-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-copy');
      var text = '';
      if (type === 'hex') text = hexEl.textContent;
      if (type === 'rgb') text = 'rgb(' + rgbEl.textContent + ')';
      if (type === 'hsl') text = 'hsl(' + hslEl.textContent + ')';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Copied ' + text);
        });
      }
    });
  });

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 1800);
  }

  /* ---------- palette save (localStorage) ---------- */
  var STORAGE_KEY = 'wheelpicker_palette';

  function loadPalette() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function savePaletteToStorage(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) { /* storage unavailable */ }
  }

  function renderPalette() {
    var list = loadPalette();
    paletteEl.innerHTML = '';
    list.forEach(function (hex) {
      var span = document.createElement('span');
      span.style.background = hex;
      span.title = hex + ' (click to remove)';
      span.addEventListener('click', function () {
        var updated = loadPalette().filter(function (c) { return c !== hex; });
        savePaletteToStorage(updated);
        renderPalette();
      });
      paletteEl.appendChild(span);
    });
  }

  saveBtn.addEventListener('click', function () {
    var hex = hexEl.textContent;
    var list = loadPalette();
    if (list.indexOf(hex) === -1) {
      list.unshift(hex);
      list = list.slice(0, 12);
      savePaletteToStorage(list);
      renderPalette();
      showToast('Saved ' + hex + ' to palette');
    } else {
      showToast(hex + ' is already saved');
    }
  });

  drawWheel();
  updateReadout();
  renderPalette();

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.how-card, .wheel-tile, .feature-card, .use-card, .testimonial-card, .faq-item'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }
})();
