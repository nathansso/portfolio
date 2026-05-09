/**
 * Skill autocomplete + pill filter for projects.html.
 * Call initAutocomplete() once with DOM refs and a change callback.
 * Returns { clearAll } for external reset (e.g. clear button).
 */
export function initAutocomplete({ autocompleteEl, searchWrap, tagInput, searchInput, allSkills, onFilterChange }) {
  let activeSkillPills = [];
  let autocompleteActiveIndex = -1;

  function getDropdownItems() {
    return [...autocompleteEl.querySelectorAll('.pj-autocomplete-item')];
  }

  function setAutocompleteActive(index) {
    getDropdownItems().forEach((item, i) => item.classList.toggle('is-active', i === index));
    autocompleteActiveIndex = index;
  }

  function closeAutocomplete() {
    autocompleteEl.hidden = true;
    autocompleteActiveIndex = -1;
  }

  function showSuggestions(q) {
    if (!q) { closeAutocomplete(); return; }
    const lower = q.toLowerCase();
    const matches = allSkills
      .filter(s => s.toLowerCase().includes(lower) && !activeSkillPills.includes(s))
      .slice(0, 8);
    if (!matches.length) { closeAutocomplete(); return; }
    autocompleteEl.innerHTML = matches.map(s =>
      `<li class="pj-autocomplete-item" role="option">${s}</li>`
    ).join('');
    autocompleteEl.hidden = false;
    autocompleteActiveIndex = -1;
  }

  function syncHasValue() {
    searchWrap.classList.toggle('has-value', activeSkillPills.length > 0 || searchInput.value.length > 0);
  }

  function renderPills() {
    tagInput.querySelectorAll('.skill-pill').forEach(el => el.remove());
    for (const skill of activeSkillPills) {
      const pill = document.createElement('span');
      pill.className = 'skill-pill';
      pill.dataset.skill = skill;
      pill.innerHTML = `${skill}<button class="skill-pill-remove" aria-label="Remove ${skill}" tabindex="-1">×</button>`;
      tagInput.insertBefore(pill, searchInput);
    }
    tagInput.classList.toggle('has-pills', activeSkillPills.length > 0);
    syncHasValue();
    onFilterChange([...activeSkillPills]);
  }

  function addPill(val) {
    const trimmed = val.trim();
    if (!trimmed || activeSkillPills.includes(trimmed)) return;
    activeSkillPills.push(trimmed);
    searchInput.value = '';
    closeAutocomplete();
    renderPills();
  }

  function clearAll() {
    activeSkillPills = [];
    searchInput.value = '';
    tagInput.querySelectorAll('.skill-pill').forEach(el => el.remove());
    tagInput.classList.remove('has-pills');
    searchWrap.classList.remove('has-value');
    closeAutocomplete();
    searchInput.focus();
    onFilterChange([]);
  }

  // Pill remove / tag-input click
  tagInput.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.skill-pill-remove');
    if (removeBtn) {
      activeSkillPills = activeSkillPills.filter(s => s !== removeBtn.closest('.skill-pill').dataset.skill);
      renderPills();
      return;
    }
    searchInput.focus();
  });

  // Autocomplete item click
  autocompleteEl.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.pj-autocomplete-item');
    if (!item) return;
    e.preventDefault();
    addPill(item.textContent.trim());
  });

  // Typing
  searchInput.addEventListener('input', () => {
    syncHasValue();
    showSuggestions(searchInput.value);
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && !autocompleteEl.hidden) {
      e.preventDefault();
      const items = getDropdownItems();
      setAutocompleteActive((autocompleteActiveIndex + 1) % items.length);
    } else if (e.key === 'ArrowUp' && !autocompleteEl.hidden) {
      e.preventDefault();
      const items = getDropdownItems();
      setAutocompleteActive((autocompleteActiveIndex - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!autocompleteEl.hidden && autocompleteActiveIndex >= 0) {
        addPill(getDropdownItems()[autocompleteActiveIndex].textContent.trim());
      } else {
        const val = searchInput.value.trim();
        if (val) addPill(val);
        else closeAutocomplete();
      }
    } else if (e.key === 'Tab' && !autocompleteEl.hidden) {
      const items = getDropdownItems();
      const target = autocompleteActiveIndex >= 0 ? items[autocompleteActiveIndex] : items[0];
      if (target) { e.preventDefault(); addPill(target.textContent.trim()); }
    } else if (e.key === 'Backspace' && searchInput.value === '' && activeSkillPills.length > 0) {
      activeSkillPills.pop();
      renderPills();
    } else if (e.key === 'Escape') {
      closeAutocomplete();
    }
  });

  // Close on blur (delayed so mousedown on item fires first)
  searchInput.addEventListener('blur', () => {
    setTimeout(closeAutocomplete, 150);
  });

  return { clearAll };
}
