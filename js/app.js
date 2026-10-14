(() => {
  const state = { websites: [], categories: [], category: 'All', query: '' };
  const $ = (selector) => document.querySelector(selector);
  const categoryGrid = $('#categoryGrid'), websiteGrid = $('#websiteGrid'), filterChips = $('#filterChips');
  const safeUrl = (value) => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = (value) => String(value || '').toLowerCase().trim();

  async function init() {
    $('#year').textContent = new Date().getFullYear();
    if (localStorage.getItem('allwebhub-theme') === 'dark') document.body.classList.add('dark');
    try {
      const [websitesResponse, categoriesResponse] = await Promise.all([fetch('data/websites.json'), fetch('data/categories.json')]);
      if (!websitesResponse.ok || !categoriesResponse.ok) throw new Error('Could not load the directory data.');
      state.websites = (await websitesResponse.json()).filter(site => safeUrl(site.url));
      state.categories = await categoriesResponse.json();
      $('#siteCount').textContent = `${state.websites.length}+`;
      $('#categoryCount').textContent = state.categories.length;
      renderCategories(); renderFilterChips(); renderWebsites();
    } catch (error) {
      categoryGrid.innerHTML = '<p class="loading-state">Unable to load directory data. Start this project with VS Code Live Server or <code>python -m http.server 8000</code>.</p>';
      websiteGrid.innerHTML = '';
      $('#resultSummary').textContent = error.message;
    }
  }

  function renderCategories() {
    categoryGrid.innerHTML = state.categories.map(category => {
      const count = state.websites.filter(site => site.category === category.name).length;
      return `<button class="category-card ${state.category === category.name ? 'selected' : ''}" data-category-pick="${escapeHtml(category.name)}"><span class="category-icon" style="background:${category.color};color:${category.textColor}">${escapeHtml(category.icon)}</span><span><strong>${escapeHtml(category.name)}</strong><small>${count} website${count === 1 ? '' : 's'}</small></span></button>`;
    }).join('');
  }
  function renderFilterChips() {
    filterChips.innerHTML = ['All', ...state.categories.map(category => category.name)].map(name => `<button class="filter-chip ${state.category === name ? 'active' : ''}" data-category="${escapeHtml(name)}">${name === 'All' ? 'All websites' : escapeHtml(name)}</button>`).join('');
  }
  function filteredWebsites() {
    const query = normalize(state.query);
    let items = state.websites.filter(site => (state.category === 'All' || site.category === state.category) && (!query || normalize([site.name, site.category, site.description, ...(site.tags || [])].join(' ')).includes(query)));
    const sort = $('#sortSelect').value;
    if (sort === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
    else if (sort === 'category') items.sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    else items.sort((a,b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
    return items;
  }
  function renderWebsites() {
    const items = filteredWebsites();
    $('#resultSummary').textContent = `Showing ${items.length} of ${state.websites.length} websites${state.category !== 'All' ? ` in ${state.category}` : ''}${state.query ? ` for “${state.query}”` : ''}.`;
    $('#emptyState').classList.toggle('d-none', items.length > 0);
    websiteGrid.classList.toggle('d-none', items.length === 0);
    websiteGrid.innerHTML = items.map(site => {
      const url = safeUrl(site.url); const domain = new URL(url).hostname.replace(/^www\./, '');
      return `<article class="website-card"><div class="website-card-top"><div class="site-logo" style="--logo-bg:${site.color || '#eff0ff'};--logo-color:${site.textColor || '#4e5bdb'}">${escapeHtml(site.initial || site.name.slice(0,1))}</div><span class="site-category">${escapeHtml(site.category)}</span></div><h3>${escapeHtml(site.name)}</h3><p>${escapeHtml(site.description)}</p><div class="website-card-footer"><span class="site-domain">${escapeHtml(domain)}</span><a class="visit-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Visit website ↗</a></div></article>`;
    }).join('');
  }
  function setCategory(category) { state.category = category; renderCategories(); renderFilterChips(); renderWebsites(); }
  function setQuery(query) { state.query = query.trim(); $('#heroSearch').value = state.query; renderWebsites(); $('#directory').scrollIntoView({behavior:'smooth', block:'start'}); }

  $('#heroSearchForm').addEventListener('submit', event => { event.preventDefault(); setQuery($('#heroSearch').value); });
  $('#heroSearch').addEventListener('input', event => { state.query = event.target.value.trim(); renderWebsites(); });
  document.addEventListener('click', event => {
    const categoryButton = event.target.closest('[data-category], [data-category-pick]');
    if (categoryButton) { setCategory(categoryButton.dataset.category || categoryButton.dataset.categoryPick); if (categoryButton.hasAttribute('data-category-pick')) $('#directory').scrollIntoView({behavior:'smooth'}); }
    const popular = event.target.closest('[data-search]'); if (popular) setQuery(popular.dataset.search);
  });
  $('#sortSelect').addEventListener('change', renderWebsites);
  $('#clearSearch').addEventListener('click', () => { state.query = ''; $('#heroSearch').value = ''; setCategory('All'); $('#sortSelect').value = 'featured'; renderWebsites(); });
  $('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('allwebhub-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
  init();
})();
