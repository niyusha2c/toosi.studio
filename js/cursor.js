// toosi.studio cursor: a small dot that lags behind the pointer, inverts whatever is under it
// (mix-blend-mode: difference) and grows over links.
//
// The visible colour is |background - dot|. With DOT_COLOUR #c8b417 (mustard):
//   on cream (#f2eee2)              -> #2a3acb ultramarine
//   on ultramarine (#2a3acb), text  -> #9e7ab4 lilac
// Other tested values: #ffffff (near-black on cream, yellow on blue), #0dbcb5 (red on cream, dark green on blue).
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const DOT_COLOUR = '#c8b417';
  const LINK = 'a, button, [role="button"]';
  const SMALL = 12;
  const LARGE = 44;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = reduced ? 1 : 0.18; // 1 = no lag

  const style = document.createElement('style');
  style.textContent = 'html, body, a, button, [role="button"] { cursor: none !important; }';
  document.head.appendChild(style);

  const dot = document.createElement('div');
  dot.setAttribute('aria-hidden', 'true');
  Object.assign(dot.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    borderRadius: '50%',
    width: SMALL + 'px',
    height: SMALL + 'px',
    background: DOT_COLOUR,
    mixBlendMode: 'difference',
    opacity: '0',
    transition: 'width .2s, height .2s, opacity .2s'
  });
  document.body.appendChild(dot);

  let tx = 0, ty = 0, x = 0, y = 0, size = SMALL, seen = false;

  addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!seen) { x = tx; y = ty; seen = true; }
    dot.style.opacity = '1';
    size = e.target.closest && e.target.closest(LINK) ? LARGE : SMALL;
    dot.style.width = dot.style.height = size + 'px';
  });
  document.documentElement.addEventListener('pointerleave', () => { dot.style.opacity = '0'; });

  (function frame() {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    dot.style.transform = 'translate3d(' + (x - size / 2) + 'px,' + (y - size / 2) + 'px,0)';
    requestAnimationFrame(frame);
  })();
})();
