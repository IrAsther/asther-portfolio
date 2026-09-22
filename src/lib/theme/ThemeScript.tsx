export function ThemeScript() {
  const code = `
(function() {
  try {
    var stored = localStorage.getItem('asther-theme');
    var theme = 'light';
    if (stored === 'dark' || stored === 'light') {
      theme = stored;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
