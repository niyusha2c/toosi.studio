const dot = document.createElement('div');
dot.id = 'cursor-dot';
dot.style.cssText = 'position:fixed;top:0;left:0;width:14px;height:14px;border-radius:50%;background:#fff;mix-blend-mode:difference;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .15s ease,height .15s ease;';
document.body.appendChild(dot);

const isTouch = matchMedia('(pointer: coarse)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isTouch && !reduceMotion) {
  document.documentElement.style.cursor = 'none';
  let tx = 0, ty = 0, x = 0, y = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.opacity = '1';
  });

  function loop() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, .row, .item, button')) {
      dot.style.width = '34px';
      dot.style.height = '34px';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, .row, .item, button')) {
      dot.style.width = '14px';
      dot.style.height = '14px';
    }
  });
} else {
  dot.remove();
}
