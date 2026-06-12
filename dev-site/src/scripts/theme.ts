export function initMode(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.mode-toggle');
  if (!toggle) return;
  const label = toggle.querySelector<HTMLElement>('.mode-label');

  const apply = (mode: 'pro' | 'pop') => {
    document.documentElement.dataset.mode = mode;
    if (label) {
      label.textContent =
        mode === 'pop' ? toggle.dataset.labelPop ?? 'pop' : toggle.dataset.labelPro ?? 'pro';
    }
    try {
      localStorage.setItem('fl-mode', mode);
    } catch {
    }
  };

  apply(document.documentElement.dataset.mode === 'pop' ? 'pop' : 'pro');
  toggle.addEventListener('click', () => {
    apply(document.documentElement.dataset.mode === 'pop' ? 'pro' : 'pop');
  });
}
