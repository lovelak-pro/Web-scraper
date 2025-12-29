// Theme toggle functionality
(function() {
  const body = document.body;
  const THEME_KEY = 'emailPhoneScraperTheme';
  
  // Load saved theme preference
  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    body.classList.toggle('dark-mode');
    
    // Save to localStorage
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }
  
  // Initialize theme on load
  loadTheme();
  
  // Add click event listener (with null check)
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
})();

