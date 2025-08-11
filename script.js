// JavaScript to handle tab toggling and dark mode on Francis' personal page.
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  // Also reference the root <html> element to apply dark-mode class there.  This ensures the
  // entire page, including areas outside the body, inherits the dark background.
  const htmlEl = document.documentElement;
  // Gather references to each bio section
  const bioSections = {
    short: document.querySelector('.bio.short'),
    long: document.querySelector('.bio.long'),
    projects: document.querySelector('.bio.projects'),
    skills: document.querySelector('.bio.skills'),
  };
  // Gather references to each button
  const buttons = {
    short: document.getElementById('short'),
    long: document.getElementById('long'),
    proj: document.getElementById('proj'),
    skill: document.getElementById('skill'),
  };

  /**
   * Show the requested section and highlight the corresponding button.
   * @param {string} sectionKey - key of the section to show
   * @param {string} buttonKey - key of the button to highlight
   */
  function showSection(sectionKey, buttonKey) {
    // Hide all sections
    Object.values(bioSections).forEach((sec) => {
      sec.classList.remove('show');
    });
    // Remove 'active' from all buttons
    Object.values(buttons).forEach((btn) => {
      btn.classList.remove('active');
    });
    // Show desired section and mark its button
    if (bioSections[sectionKey]) {
      bioSections[sectionKey].classList.add('show');
    }
    if (buttons[buttonKey]) {
      buttons[buttonKey].classList.add('active');
    }
  }

  // Initial display: short biography
  showSection('short', 'short');

  // Attach handlers to each button
  buttons.short.addEventListener('click', () => showSection('short', 'short'));
  buttons.long.addEventListener('click', () => showSection('long', 'long'));
  buttons.proj.addEventListener('click', () => showSection('projects', 'proj'));
  buttons.skill.addEventListener('click', () => showSection('skills', 'skill'));

  // Dark mode toggle
  const darkToggle = document.getElementById('toggler');
  // Restore preference from localStorage
  const storedPref = localStorage.getItem('darkMode');
  if (storedPref === 'enabled') {
    body.classList.add('dark-mode');
    htmlEl.classList.add('dark-mode');
    darkToggle.checked = true;
  }
  // Listen for changes on the checkbox
  darkToggle.addEventListener('change', function () {
    if (this.checked) {
      body.classList.add('dark-mode');
      htmlEl.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      body.classList.remove('dark-mode');
      htmlEl.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });
});