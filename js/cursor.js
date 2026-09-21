// toosi.studio cursor: a small dot that lags behind the pointer, inverts whatever is under it
// (mix-blend-mode: difference) and grows over links.
//
// The visible colour is |background - dot|. With DOT_COLOUR #c8b417 (mustard):
//   on cream (#f2eee2)              -> #2a3acb ultramarine
//   on ultramarine (#2a3acb), text  -> #9e7ab4 lilac
// Other tested values: #ffffff (near-black on cream, yellow on blue), #0dbcb5 (red on cream, dark green on blue).
//
// The dot is always drawn at its large size and shrunk with `scale`, so its centre never moves when it
// grows or shrinks. It grows immediately over a link and shrinks after a short delay, so moving across the
// gaps between neighbouring links doesn't make it pulse.
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const DOT_COLOUR = '#c8b417';
  const LINK = 'a, button, [role="button"]';
  const SMALL = 12;
  const LARGE = 44;
  const SHRINK_DELAY = 160; // ms
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
    width: LARGE + 'px',
    height: LARGE + 'px',
    background: DOT_COLOUR,
    mixBlendMode: 'difference',
    opacity: '0',
    scale: String(SMALL / LARGE),
    transition: reduced ? 'none' : 'scale .28s cubic-bezier(.22,.61,.36,1), opacity .2s',
    willChange: 'transform, scale'
  });
  document.body.appendChild(dot);

  let tx = 0, ty = 0, x = 0, y = 0, seen = false;
  let big = false, timer = null;

  function grow() {
    clearTimeout(timer);
    timer = null;
    if (!big) { big = true; dot.style.scale = '1'; }
  }
  function shrinkSoon() {
    if (!big || timer) return;
    timer = setTimeout(() => {
      timer = null;
      big = false;
      dot.style.scale = String(SMALL / LARGE);
    }, SHRINK_DELAY);
  }

  addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!seen) { x = tx; y = ty; seen = true; }
    dot.style.opacity = '1';
    if (e.target.closest && e.target.closest(LINK)) grow(); else shrinkSoon();
  });
  document.documentElement.addEventListener('pointerleave', () => {
    dot.style.opacity = '0';
    clearTimeout(timer); timer = null;
    big = false;
    dot.style.scale = String(SMALL / LARGE);
  });

  (function frame() {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    dot.style.transform = 'translate3d(' + (x - LARGE / 2) + 'px,' + (y - LARGE / 2) + 'px,0)';
    requestAnimationFrame(frame);
  })();
})();
