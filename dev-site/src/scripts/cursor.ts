export function initCursor(): void {
  const touchOnly = matchMedia('(hover: none)').matches;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (touchOnly || calm) return;

  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-cursor');

  let px = innerWidth / 2;
  let py = innerHeight / 2;
  let rx = px;
  let ry = py;

  addEventListener('pointermove', (e) => {
    px = e.clientX;
    py = e.clientY;
    dot.style.translate = `${px}px ${py}px`;
    const target = (e.target as Element | null)?.closest('a, button, [data-interactive]');
    ring.classList.toggle('is-hover', !!target);
  });

  const follow = () => {
    rx += (px - rx) * 0.16;
    ry += (py - ry) * 0.16;
    ring.style.translate = `${rx}px ${ry}px`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);

  addEventListener('pointerdown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}
