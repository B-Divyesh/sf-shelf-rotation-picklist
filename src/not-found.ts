import './styles.css';

const REAL_STORAGE_KEY = 'shelf-rotation-picklist:v1';
const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
const themeButton = document.querySelector<HTMLButtonElement>('#theme-toggle');
const buildId = document.querySelector<HTMLElement>('#build-id');

if (canonical) canonical.href = `${window.location.origin}${window.location.pathname}`;
if (buildId) buildId.textContent = import.meta.env.VITE_BUILD_ID || 'local-1.0.0';

function savedTheme(): 'light' | 'dark' {
  try {
    const parsed = JSON.parse(localStorage.getItem(REAL_STORAGE_KEY) ?? '{}') as { theme?: string };
    return parsed.theme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.dataset.theme = theme;
  if (themeButton) themeButton.textContent = theme === 'light' ? 'Use dark theme' : 'Use light theme';
}

applyTheme(savedTheme());
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    const stored = JSON.parse(localStorage.getItem(REAL_STORAGE_KEY) ?? '{}') as Record<string, unknown>;
    localStorage.setItem(REAL_STORAGE_KEY, JSON.stringify({ ...stored, theme }));
  } catch { /* The visual change still works if browser storage is unavailable. */ }
  applyTheme(theme);
});
