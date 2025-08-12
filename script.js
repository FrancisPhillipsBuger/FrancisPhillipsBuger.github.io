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
    research: document.querySelector('.bio.research'),
    skills: document.querySelector('.bio.skills'),
    interests: document.querySelector('.bio.interests'),
  };
  // Gather references to each button
  const buttons = {
    short: document.getElementById('short'),
    long: document.getElementById('long'),
    research: document.getElementById('research-interests'),
    skill: document.getElementById('skill'),
    interests: document.getElementById('daily-interests'),
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
  if (buttons.research) {
    buttons.research.addEventListener('click', () => showSection('research', 'research'));
  }
  buttons.skill.addEventListener('click', () => showSection('skills', 'skill'));
  if (buttons.interests) {
    buttons.interests.addEventListener('click', () => showSection('interests', 'interests'));
  }

  // Interactive research tags: toggle selection and persist
  const researchItems = Array.from(document.querySelectorAll('.research-item'));
  const savedResearch = JSON.parse(localStorage.getItem('selectedResearch') || '[]');
  researchItems.forEach((el) => {
    if (savedResearch.includes(el.textContent)) {
      el.classList.add('selected');
    }
    const toggle = () => {
      el.classList.toggle('selected');
      const current = researchItems
        .filter((n) => n.classList.contains('selected'))
        .map((n) => n.textContent);
      localStorage.setItem('selectedResearch', JSON.stringify(current));
    };
    el.addEventListener('click', toggle);
    el.addEventListener('keypress', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  });

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

  // Active underline for nav links based on current hash
  const navLinks = Array.from(document.querySelectorAll('.links a'));
  function setActiveNavFromHash() {
    const hash = window.location.hash;
    navLinks.forEach((a) => a.classList.remove('active'));
    if (!hash) return;
    const match = navLinks.find((a) => a.getAttribute('href') === hash);
    if (match) match.classList.add('active');
  }
  // Initialize and update on hash changes
  setActiveNavFromHash();
  window.addEventListener('hashchange', setActiveNavFromHash);

  // Snackbar: show temporary message when clicking Scholar/Github/CV links
  const snackbar = document.getElementById('snackbar');
  let snackbarTimer = null;

  function bindComingSoon(link) {
    if (!link || !snackbar) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      snackbar.textContent = 'Coming soon';
      snackbar.classList.add('show');
      if (snackbarTimer) clearTimeout(snackbarTimer);
      snackbarTimer = setTimeout(() => snackbar.classList.remove('show'), 5000);
    });
  }

  document.querySelectorAll('[data-coming-soon]').forEach(bindComingSoon);

  // --- Auto toggle primary name with typewriter effect (English <-> Chinese) ---
  const namePrimaryEl = document.getElementById('name-primary');
  if (namePrimaryEl) {
    const englishText = namePrimaryEl.textContent.trim();
    const chineseText = namePrimaryEl.getAttribute('data-alt') || englishText;
    const phoneticText = namePrimaryEl.getAttribute('data-phonetic') || '';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Utilities for async typing/deleting
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function typeText(text, speedMs) {
      namePrimaryEl.textContent = '';
      for (let i = 1; i <= text.length; i += 1) {
        namePrimaryEl.textContent = text.slice(0, i);
        await sleep(speedMs);
      }
    }

    async function deleteText(speedMs) {
      const current = namePrimaryEl.textContent;
      for (let i = current.length; i >= 0; i -= 1) {
        namePrimaryEl.textContent = current.slice(0, i);
        await sleep(speedMs);
      }
    }

    async function loopTypewriter() {
      const typeSpeed = 80;      // ms per character when typing
      const deleteSpeed = 55;    // ms per character when deleting
      const holdMs = 1200;       // pause after typing a full name
      let phase = 0; // 0: English, 1: Chinese, 2: Phonetic

      // Add caret style
      namePrimaryEl.classList.add('typewriter');

      // Run forever
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const options = [englishText, chineseText, phoneticText || englishText];
        const nextText = options[phase % options.length];
        await typeText(nextText, typeSpeed);
        await sleep(holdMs);
        await deleteText(deleteSpeed);
        await sleep(350);
        phase = (phase + 1) % options.length;
      }
    }

    if (prefersReduced) {
      // Respect reduced motion: cycle through the three forms without typing effect
      const options = [englishText, chineseText, phoneticText || englishText];
      let idx = 0;
      namePrimaryEl.textContent = options[idx];
      setInterval(() => {
        idx = (idx + 1) % options.length;
        namePrimaryEl.textContent = options[idx];
      }, 3000);
    } else {
      // Start animated loop
      loopTypewriter();
    }
  }

  // --- Research filter menu (years, tags, type) ---
  const researchContainer = document.getElementById('research');
  if (researchContainer) {
    const filtersToggle = document.getElementById('filters-enabled');
    const publicationList = researchContainer.querySelector('.papers[data-list="publication"]');
    const projectList = researchContainer.querySelector('.projects[data-list="project"]');
    const allEntries = Array.from(researchContainer.querySelectorAll('.research-entry'));
    const yearsRow = document.getElementById('menu-years');
    const tagsRow = document.getElementById('menu-tags');
    const typeRow = document.getElementById('menu-type');

    // Build unique years and tags from entries
    const years = Array.from(new Set(allEntries.map(el => el.getAttribute('data-year')).filter(Boolean)))
      .sort((a,b) => Number(b) - Number(a));
    const tags = Array.from(new Set(allEntries
      .flatMap(el => (el.getAttribute('data-tags') || '').split(',').map(s => s.trim()).filter(Boolean))
    ))
      .sort((a,b) => a.localeCompare(b));

    const state = {
      type: 'publication',
      year: null,
      tag: null,
    };

    function renderMenu() {
      // Years
      if (yearsRow && years.length) {
        yearsRow.innerHTML = years.map(y => `<button class="menu-item" data-year="${y}" type="button">${y}</button>`).join('');
      }
      // Tags
      if (tagsRow && tags.length) {
        tagsRow.innerHTML = tags.map(t => `<button class="menu-item" data-tag="${t}">#${t}</button>`).join('');
      }
      // Activate listeners
      yearsRow?.querySelectorAll('.menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
          state.year = state.year === btn.dataset.year ? null : btn.dataset.year;
          updateActiveButtons();
          applyFilters();
        });
      });
      tagsRow?.querySelectorAll('.menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
          state.tag = state.tag === btn.dataset.tag ? null : btn.dataset.tag;
          updateActiveButtons();
          applyFilters();
        });
      });
      typeRow?.querySelectorAll('.menu-item.type').forEach(btn => {
        btn.addEventListener('click', () => {
          state.type = btn.dataset.type;
          updateActiveButtons();
          applyFilters();
        });
      });
      updateActiveButtons();
    }

    function updateActiveButtons() {
      const enableFilters = filtersToggle?.checked ?? false;
      // Type buttons
      typeRow?.querySelectorAll('.menu-item.type').forEach(b => b.classList.toggle('active', b.dataset.type === state.type));
      // Year buttons
      yearsRow?.querySelectorAll('.menu-item').forEach(b => b.classList.toggle('active', b.dataset.year === state.year));
      // Tag buttons
      tagsRow?.querySelectorAll('.menu-item').forEach(b => b.classList.toggle('active', b.dataset.tag === state.tag));
      // Toggle lists visibility
      if (publicationList && projectList) {
        if (!enableFilters) {
          // Show both when filters are disabled
          publicationList.hidden = false;
          projectList.hidden = false;
        } else {
          if (state.type === 'publication') {
            publicationList.hidden = false;
            projectList.hidden = true;
          } else {
            publicationList.hidden = true;
            projectList.hidden = false;
          }
        }
      }
      // Show/Hide the menu panel
      const menuPanel = researchContainer.querySelector('.research-menu');
      if (menuPanel) menuPanel.style.display = enableFilters ? '' : 'none';
    }

    function applyFilters() {
      const enableFilters = filtersToggle?.checked ?? false;
      if (!enableFilters) {
        // If filters are disabled, show all entries in both lists
        [publicationList, projectList].forEach(list => {
          list?.querySelectorAll('.research-entry').forEach(el => { el.style.display = ''; });
        });
        return;
      }
      const isPublication = state.type === 'publication';
      const visibleList = isPublication ? publicationList : projectList;
      const entries = Array.from(visibleList?.querySelectorAll('.research-entry') || []);
      entries.forEach(el => {
        const okYear = !state.year || el.getAttribute('data-year') === state.year;
        const tagsAttr = (el.getAttribute('data-tags') || '').split(',').map(s => s.trim());
        const okTag = !state.tag || tagsAttr.includes(state.tag);
        el.style.display = okYear && okTag ? '' : 'none';
      });
    }

    renderMenu();
    applyFilters();

    // Listen to toggle changes
    if (filtersToggle) {
      filtersToggle.addEventListener('change', () => {
        updateActiveButtons();
        applyFilters();
      });
    }
  }
});