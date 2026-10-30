(() => {
  const root = document.getElementById('iym-site');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const menuButton = root.querySelector('.menu-toggle');
  const nav = root.querySelector('#main-nav');
  const originalShopLink = [...(nav?.querySelectorAll('a') || [])].find(link => {
    const href = link.getAttribute('href') || '';
    return link.dataset.destination === 'shop' || /(^|\/)shop\.html(?:[?#].*)?$/.test(href);
  });
  if (originalShopLink) {
    const originalShopHref = originalShopLink.getAttribute('href') || 'shop.html';
    const sitePrefix = originalShopHref.endsWith('shop.html')
      ? originalShopHref.slice(0, -'shop.html'.length)
      : '';
    const packagedRoutes = window.IYM_ROUTES || {};
    const siteHref = path => packagedRoutes[path] || `${sitePrefix}${path}`;
    const shopNavigation = document.createElement('div');
    shopNavigation.className = 'nav-shop';
    if (originalShopLink.getAttribute('aria-current') === 'page' || root.classList.contains('shop-category-page')) {
      shopNavigation.classList.add('is-current');
    }
    shopNavigation.innerHTML = `
      <button class="nav-shop-trigger" type="button" aria-expanded="false" aria-controls="shop-navigation-panel">
        <span>Shop</span><span class="nav-chevron" aria-hidden="true"></span>
      </button>
      <div class="shop-navigation-panel" id="shop-navigation-panel">
        <div class="shop-navigation-heading"><span>Shop by category</span><a href="${siteHref('shop.html')}">View all</a></div>
        <div class="shop-navigation-layout">
          <div class="shop-navigation-categories">
            <div class="shop-navigation-primary">
              <a href="${siteHref('shop-bundles.html')}"><span class="shop-link-number">01</span><span>Bundles</span></a>
              <a href="${siteHref('shop-elementary.html')}"><span class="shop-link-number">02</span><span>Elementary Products <small>Grades K–5</small></span></a>
              <a href="${siteHref('shop-middle-school.html')}"><span class="shop-link-number">03</span><span>Middle School Products <small>Grades 6–8</small></span></a>
              <a href="${siteHref('shop-high-school.html')}"><span class="shop-link-number">04</span><span>High School Products <small>Grades 9–12</small></span></a>
              <a href="${siteHref('courses.html')}"><span class="shop-link-number">05</span><span>Courses <small>Guided learning</small></span></a>
            </div>
            <div class="shop-navigation-groups">
              <details class="shop-navigation-group" open>
                <summary>Apparel <span class="nav-chevron" aria-hidden="true"></span></summary>
                <div>
                  <a class="shop-navigation-all" href="${siteHref('shop-apparel.html')}">Shop all apparel</a>
                  <a href="${siteHref('shop-sweatshirts-hoodies.html')}">Sweatshirts &amp; Hoodies</a>
                  <a href="${siteHref('shop-t-shirts.html')}">T-Shirts</a>
                  <a href="${siteHref('shop-kids-clothing.html')}">Kids' Clothing</a>
                </div>
              </details>
              <details class="shop-navigation-group" open>
                <summary>Accessories <span class="nav-chevron" aria-hidden="true"></span></summary>
                <div>
                  <a class="shop-navigation-all" href="${siteHref('shop-accessories.html')}">Shop all accessories</a>
                  <a href="${siteHref('shop-bags-totes.html')}">Bags &amp; Totes</a>
                  <a href="${siteHref('shop-keyrings.html')}">Keyrings &amp; Travel Accessories</a>
                  <a href="${siteHref('shop-mugs-drinkware.html')}">Ceramic Mugs &amp; Drinkware</a>
                  <a href="${siteHref('shop-journals-planners.html')}">Journals &amp; Planners</a>
                </div>
              </details>
            </div>
          </div>
          <div class="shop-navigation-featured" aria-label="Featured shop collections">
            <p>Featured learning</p>
            <div class="shop-featured-grid">
              <a class="shop-featured-card shop-featured-main" href="${siteHref('shop-bundles.html')}"><img src="${siteHref('assets/product-0.jpg')}" alt="Money Matters elementary financial literacy bundle" width="750" height="750"><span><small>Learning bundle</small><strong>Elementary learning</strong></span></a>
              <a class="shop-featured-card" href="${siteHref('shop-middle-school.html')}"><img src="${siteHref('assets/product-2.jpg')}" alt="Money Moves financial literacy learning books" width="750" height="750"><span><small>Grades 6–8</small><strong>Middle school</strong></span></a>
              <a class="shop-featured-card" href="${siteHref('shop-high-school.html')}"><img src="${siteHref('assets/product-1.jpg')}" alt="High school financial learning book bundle" width="750" height="750"><span><small>Grades 9–12</small><strong>High school</strong></span></a>
            </div>
          </div>
        </div>`;
    originalShopLink.replaceWith(shopNavigation);
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    shopNavigation.querySelectorAll('a').forEach(link => {
      const linkFile = new URL(link.href, window.location.href).pathname.split('/').pop();
      if (linkFile === currentFile) link.setAttribute('aria-current', 'page');
    });
  }
  const navShop = nav?.querySelector('.nav-shop');
  const shopTrigger = navShop?.querySelector('.nav-shop-trigger');
  const mobileNavigation = window.matchMedia('(max-width: 900px)');
  let shopCloseTimer;
  function setShopMenu(open, returnFocus = false) {
    if (!navShop || !shopTrigger) return;
    window.clearTimeout(shopCloseTimer);
    navShop.classList.toggle('is-open', open);
    shopTrigger.setAttribute('aria-expanded', String(open));
    if (returnFocus) shopTrigger.focus();
  }
  function scheduleShopMenuClose() {
    window.clearTimeout(shopCloseTimer);
    shopCloseTimer = window.setTimeout(() => {
      if (!navShop?.matches(':hover') && !navShop?.contains(document.activeElement)) setShopMenu(false);
    }, 240);
  }
  // Keep the homepage overlay aligned if fonts or GHL sizing change header height.
  if (!root.classList.contains('inner-page') && 'ResizeObserver' in window) {
    const header = root.querySelector('.site-header');
    const headerObserver = new ResizeObserver(() => {
      root.style.setProperty('--nav-height', `${header.getBoundingClientRect().height}px`);
    });
    headerObserver.observe(header);
  }
  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    menuButton.querySelector('span').textContent = open ? 'Close' : 'Menu';
    if (!open) setShopMenu(false);
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  shopTrigger?.addEventListener('click', () => {
    const isOpen = shopTrigger.getAttribute('aria-expanded') === 'true';
    setShopMenu(mobileNavigation.matches ? !isOpen : true);
  });
  navShop?.addEventListener('pointerenter', () => { if (!mobileNavigation.matches) setShopMenu(true); });
  navShop?.addEventListener('pointerleave', () => { if (!mobileNavigation.matches) scheduleShopMenuClose(); });
  navShop?.addEventListener('focusin', () => { if (!mobileNavigation.matches) setShopMenu(true); });
  navShop?.addEventListener('focusout', event => {
    if (!mobileNavigation.matches && !navShop.contains(event.relatedTarget)) setShopMenu(false);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  root.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (shopTrigger?.getAttribute('aria-expanded') === 'true') setShopMenu(false, true);
    else if (menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', e => {
    if (!navShop?.contains(e.target)) setShopMenu(false);
    if (!root.querySelector('.site-header').contains(e.target)) setMenu(false);
  });
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  function activate(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
      const panel = root.querySelector('#' + item.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.classList.toggle('is-changing', active);
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); activate(tabs[next], true); }
    });
  });
  const destinations = window.IYM_DESTINATIONS || {};
  root.querySelectorAll('[data-destination]').forEach(link => {
    const destination = destinations[link.dataset.destination];
    if (destination && /^(https?:\/\/|\/|#)/.test(destination)) link.href = destination;
  });
  const catalogGrid = root.querySelector('[data-product-grid]');
  if (catalogGrid && Array.isArray(window.IYM_PRODUCTS)) {
    const category = root.dataset.shopCategory || 'all';
    const categoryMatchers = {
      bundles: /\b(bundle|pack|toolkit|collection|complete set)\b/i,
      elementary: /\b(elementary|kindergarten|grades? k|grade [1-5]|ages? [5-9])\b/i,
      middle: /\b(middle school|grades? [6-8]|ages? (10|11|12|13|14))\b/i,
      high: /\b(high school|grades? (9|10|11|12)|teen(?:ager)?s?)\b/i,
      courses: /\b(course|class|workshop|training)\b/i,
      apparel: /\b(apparel|clothing|hoodies?|sweatshirts?|crewnecks?|pullovers?|sweaters?|t-?shirts?|tees?|tank tops?|jerseys?|jackets?|bodysuits?|onesies|hats?|caps?|beanies|leggings?|shorts|pants)\b/i,
      hoodies: /\b(hoodie|hoodies|sweatshirt|sweatshirts|crewneck|crewnecks|pullover|pullovers|sweater|sweaters)\b/i,
      tshirts: /\b(t-?shirts?|tees?|tank tops?|jerseys?)\b/i,
      kidsclothing: /\b(kids?|children|youth|toddler|baby)\b.*\b(apparel|clothing|hoodie|sweatshirt|crewneck|pullover|sweater|t-?shirt|tee|tank top|jersey|jacket|bodysuit|onesie|hat|cap|beanie|leggings?|shorts|pants)\b|\b(apparel|clothing|hoodie|sweatshirt|crewneck|pullover|sweater|t-?shirt|tee|tank top|jersey|jacket|bodysuit|onesie|hat|cap|beanie|leggings?|shorts|pants)\b.*\b(kids?|children|youth|toddler|baby)\b/i,
      bags: /\b(bags?|totes?|backpacks?|pouches?|duffels?)\b/i,
      keyrings: /\b(keyrings?|keychains?|luggage tags?|travel tags?)\b/i,
      mugs: /\b(mugs?|tumblers?|drinkware|cups?)\b/i,
      journals: /\b(journals?|diar(?:y|ies)|planners?|notebooks?)\b/i,
      accessories: /\b(bags?|totes?|backpacks?|pouches?|duffels?|keyrings?|keychains?|luggage tags?|travel tags?|mugs?|tumblers?|drinkware|cups?|journals?|diar(?:y|ies)|planners?|notebooks?)\b/i
    };
    const matcher = categoryMatchers[category];
    const catalogProducts = window.IYM_PRODUCTS.filter(product => !matcher || matcher.test(product.name));
    const searchInput = root.querySelector('[data-product-search]');
    const sortSelect = root.querySelector('[data-product-sort]');
    const count = root.querySelector('[data-product-count]');
    const empty = root.querySelector('[data-product-empty]');
    const productsPerPage = 12;
    let currentPage = 1;
    const pagination = document.createElement('nav');
    pagination.className = 'catalog-pagination';
    pagination.setAttribute('aria-label', 'Product pages');
    pagination.hidden = true;
    catalogGrid.insertAdjacentElement('afterend', pagination);
    const productHref = product => {
      const href = product.href || '#';
      const previewProduct = href.match(/^\/preview\/[^/]+(\/product\/[^/?#]+(?:[?#].*)?)$/i);
      return previewProduct ? previewProduct[1] : href;
    };
    const escapeAttribute = value => String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    function productDisplayName(name) {
      const primaryName = String(name).split(/\s+\|+\s+|\s+[\u2013\u2014]\s+/)[0].trim();
      if (primaryName.length <= 72) return primaryName;
      const shortened = primaryName.slice(0, 73).replace(/\s+\S*$/, '').trim();
      return `${shortened || primaryName.slice(0, 72).trim()}\u2026`;
    }
    function paginationItems(page, totalPages) {
      const pages = new Set([1, totalPages, page - 1, page, page + 1]);
      const visiblePages = [...pages].filter(item => item >= 1 && item <= totalPages).sort((a, b) => a - b);
      const items = [];
      visiblePages.forEach((item, index) => {
        if (index && item - visiblePages[index - 1] > 1) items.push('ellipsis');
        items.push(item);
      });
      return items;
    }
    function renderPagination(totalPages) {
      pagination.hidden = totalPages <= 1;
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }
      const pageButtons = paginationItems(currentPage, totalPages).map(item => item === 'ellipsis'
        ? '<span class="catalog-pagination-ellipsis" aria-hidden="true">&hellip;</span>'
        : `<button type="button" class="catalog-pagination-page${item === currentPage ? ' is-current' : ''}" data-catalog-page="${item}"${item === currentPage ? ' aria-current="page"' : ''} aria-label="Page ${item}">${item}</button>`).join('');
      pagination.innerHTML = `
        <button type="button" class="catalog-pagination-direction" data-catalog-page="${currentPage - 1}"${currentPage === 1 ? ' disabled' : ''} aria-label="Previous product page"><span aria-hidden="true">&larr;</span><span>Previous</span></button>
        <div class="catalog-pagination-pages">${pageButtons}</div>
        <button type="button" class="catalog-pagination-direction" data-catalog-page="${currentPage + 1}"${currentPage === totalPages ? ' disabled' : ''} aria-label="Next product page"><span>Next</span><span aria-hidden="true">&rarr;</span></button>`;
    }
    function renderCatalog({scroll = false, focusPage = false} = {}) {
      const query = searchInput?.value.trim().toLowerCase() || '';
      const sort = sortSelect?.value || 'featured';
      const products = catalogProducts.filter(product => product.name.toLowerCase().includes(query));
      if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'price-low') products.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      if (sort === 'price-high') products.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));
      currentPage = Math.min(Math.max(currentPage, 1), totalPages);
      const pageStart = (currentPage - 1) * productsPerPage;
      const pageProducts = products.slice(pageStart, pageStart + productsPerPage);
      catalogGrid.innerHTML = pageProducts.map(product => {
        const fullName = escapeAttribute(product.name);
        const displayName = escapeAttribute(productDisplayName(product.name));
        const href = productHref(product);
        const hasPrice = Number.isFinite(product.price);
        return `
          <article class="catalog-product">
            <a class="catalog-product-image" href="${href}" aria-label="View ${fullName}">
              <img src="${product.image}" alt="" loading="lazy" decoding="async" width="800" height="800">
            </a>
            <div class="catalog-product-copy">
              <h2><a href="${href}" aria-label="View ${fullName}" title="${fullName}">${displayName}</a></h2>
              <div class="catalog-product-meta">
                <strong class="catalog-product-price${hasPrice ? '' : ' is-options'}">${hasPrice ? `$${product.price.toFixed(2)}` : 'Options available'}</strong>
                <a class="catalog-product-link" href="${href}" aria-label="View ${fullName} details"><span>Details</span><span aria-hidden="true">&nearr;</span></a>
              </div>
            </div>
          </article>`;
      }).join('');
      if (count) {
        if (!products.length) count.textContent = '0 products';
        else if (products.length <= productsPerPage) count.textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;
        else count.textContent = `${pageStart + 1}\u2013${Math.min(pageStart + productsPerPage, products.length)} of ${products.length} products`;
      }
      if (empty) empty.hidden = products.length !== 0;
      renderPagination(totalPages);
      if (scroll) root.querySelector('.shop-catalog')?.scrollIntoView({behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start'});
      if (focusPage) window.requestAnimationFrame(() => pagination.querySelector('[aria-current="page"]')?.focus());
    }
    pagination.addEventListener('click', event => {
      const button = event.target.closest('[data-catalog-page]');
      if (!button || button.disabled) return;
      currentPage = Number(button.dataset.catalogPage);
      renderCatalog({scroll: true, focusPage: true});
    });
    searchInput?.addEventListener('input', () => { currentPage = 1; renderCatalog(); });
    sortSelect?.addEventListener('change', () => { currentPage = 1; renderCatalog(); });
    renderCatalog();
  }
  const blogGrid = root.querySelector('[data-blog-grid]');
  if (blogGrid) {
    const cards = [...blogGrid.querySelectorAll('[data-blog-card]')];
    const filters = [...root.querySelectorAll('[data-blog-filter]')];
    const results = root.querySelector('[data-blog-results]');
    const empty = root.querySelector('[data-blog-empty]');
    const pagination = root.querySelector('[data-blog-pagination]');
    const postsPerPage = 12;
    const params = new URLSearchParams(window.location.search);
    let activeCategory = filters.some(button => button.dataset.blogFilter === params.get('topic')) ? params.get('topic') : 'all';
    let currentPage = Math.max(1, Number(params.get('page')) || 1);
    function paginationSequence(page, totalPages) {
      const visible = [...new Set([1, totalPages, page - 1, page, page + 1])]
        .filter(item => item >= 1 && item <= totalPages)
        .sort((a, b) => a - b);
      const sequence = [];
      visible.forEach((item, index) => {
        if (index && item - visible[index - 1] > 1) sequence.push('ellipsis');
        sequence.push(item);
      });
      return sequence;
    }
    function renderBlogPagination(totalPages) {
      pagination.hidden = totalPages <= 1;
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }
      const pages = paginationSequence(currentPage, totalPages).map(item => item === 'ellipsis'
        ? '<span aria-hidden="true">&hellip;</span>'
        : `<button type="button" data-blog-page="${item}"${item === currentPage ? ' aria-current="page"' : ''} aria-label="Blog page ${item}">${item}</button>`).join('');
      pagination.innerHTML = `
        <button type="button" class="blog-pagination-direction" data-blog-page="${currentPage - 1}"${currentPage === 1 ? ' disabled' : ''} aria-label="Previous blog page"><span aria-hidden="true">&larr;</span><span>Previous</span></button>
        ${pages}
        <button type="button" class="blog-pagination-direction" data-blog-page="${currentPage + 1}"${currentPage === totalPages ? ' disabled' : ''} aria-label="Next blog page"><span>Next</span><span aria-hidden="true">&rarr;</span></button>`;
    }
    function renderBlog({scroll = false, focusPage = false} = {}) {
      const matching = cards.filter(card => activeCategory === 'all' || card.dataset.category === activeCategory);
      const totalPages = Math.max(1, Math.ceil(matching.length / postsPerPage));
      currentPage = Math.min(Math.max(1, currentPage), totalPages);
      const pageStart = (currentPage - 1) * postsPerPage;
      const visible = new Set(matching.slice(pageStart, pageStart + postsPerPage));
      cards.forEach(card => { card.hidden = !visible.has(card); });
      filters.forEach(button => {
        const selected = button.dataset.blogFilter === activeCategory;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      const topic = activeCategory === 'all' ? 'all topics' : activeCategory;
      if (results) results.textContent = matching.length > postsPerPage
        ? `Showing ${pageStart + 1}\u2013${Math.min(pageStart + postsPerPage, matching.length)} of ${matching.length} articles in ${topic}.`
        : `${matching.length} ${matching.length === 1 ? 'article' : 'articles'} in ${topic}.`;
      if (empty) empty.hidden = matching.length !== 0;
      renderBlogPagination(totalPages);
      const nextParams = new URLSearchParams();
      if (activeCategory !== 'all') nextParams.set('topic', activeCategory);
      if (currentPage > 1) nextParams.set('page', String(currentPage));
      history.replaceState(null, '', `${location.pathname}${nextParams.size ? `?${nextParams}` : ''}${location.hash}`);
      if (scroll) root.querySelector('.blog-library')?.scrollIntoView({behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start'});
      if (focusPage) requestAnimationFrame(() => pagination.querySelector('[aria-current="page"]')?.focus());
    }
    filters.forEach(button => button.addEventListener('click', () => {
      activeCategory = button.dataset.blogFilter;
      currentPage = 1;
      renderBlog();
    }));
    pagination.addEventListener('click', event => {
      const button = event.target.closest('[data-blog-page]');
      if (!button || button.disabled) return;
      currentPage = Number(button.dataset.blogPage);
      renderBlog({scroll: true, focusPage: true});
    });
    renderBlog();
  }
  // Progressive motion: nothing is hidden while waiting for JavaScript or scrolling.
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => window.IYM_MOTION !== false && !motionPreference.matches;
  let revealObserver;
  const revealCandidates = [...root.querySelectorAll(
    '.intro > *, .workshop-heading, .community-photo, .workshop-details, ' +
    '.program-intro, .program-content, .testimonial > *, .approach > h2, ' +
    '.approach-grid > *, .faq > h2, .closing > *, .split-story > *, ' +
    '.section-intro, .principle-grid > *, .appointment-row, .course-grid > article, ' +
    '.topic-list > article, .blog-featured > *, .blog-library-heading, .blog-card, ' +
    '.article-cover, .article-layout > *, .related-posts .section-intro'
  )];
  const revealTargets = revealCandidates.filter(element => !revealCandidates.some(parent => parent !== element && parent.contains(element)));
  function syncMotion() {
    revealObserver?.disconnect();
    root.classList.toggle('motion-enabled', motionAllowed());
    if (!motionAllowed()) {
      root.querySelectorAll('.scroll-arrive').forEach(element => element.classList.remove('scroll-arrive'));
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        element.dataset.motionSeen = 'true';
        element.classList.add('scroll-arrive');
        revealObserver.unobserve(element);
      });
    }, {threshold: 0, rootMargin: '0px 0px -48px 0px'});
    revealTargets.forEach(element => {
      if (element.dataset.motionSeen) return;
      revealObserver.observe(element);
    });
  }
  syncMotion();
  motionPreference.addEventListener('change', syncMotion);
  const carousel = root.querySelector('.partner-carousel');
  if (carousel) {
    const group = carousel.querySelector('.partner-group');
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('img').forEach(image => { image.alt = ''; image.loading = 'eager'; });
    carousel.querySelector('.partner-track').append(duplicate);
    let visible = false;
    function syncCarousel() {
      const enabled = motionAllowed();
      carousel.classList.toggle('is-ready', enabled);
      carousel.classList.toggle('is-running', enabled && visible && !document.hidden);
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncCarousel(); });
      observer.observe(carousel);
    } else visible = true;
    document.addEventListener('visibilitychange', syncCarousel);
    motionPreference.addEventListener('change', syncCarousel);
    syncCarousel();
  }
  const hero = root.querySelector('.hero');
  if (hero && hero.querySelector('.hero-photo')) {
    let heroVisible = true;
    function syncHeroMotion() {
      root.classList.toggle('hero-motion-running', motionAllowed() && heroVisible && !document.hidden);
    }
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
        syncHeroMotion();
      });
      heroObserver.observe(hero);
    }
    document.addEventListener('visibilitychange', syncHeroMotion);
    motionPreference.addEventListener('change', syncHeroMotion);
    syncHeroMotion();
  }
  root.addEventListener('animationend', event => {
    if (event.animationName === 'iym-scroll-arrive') event.target.classList.remove('scroll-arrive');
  });
  root.addEventListener('focusin', event => {
    // Keyboard navigation never waits for an entrance effect.
    const target = event.target.closest('.scroll-arrive');
    if (target) target.classList.remove('scroll-arrive');
  });
  const form = root.querySelector('#contact-form');
  if (form) {
    const status = root.querySelector('#form-status');
    const result = root.querySelector('#draft-result');
    const draftText = root.querySelector('#draft-text');
    const draftLink = root.querySelector('#draft-link');
    const topic = new URLSearchParams(window.location.search).get('topic');
    if ([...form.elements.topic.options].some(option => option.value === topic)) form.elements.topic.value = topic;
    function prepareDraft() {
      if (!form.reportValidity()) return null;
      const values = new FormData(form);
      const message = `Hello Invest Young Money,\n\n${values.get('message').trim()}\n\nName: ${values.get('name').trim()}\nEmail: ${values.get('email').trim()}\nPhone: ${values.get('phone').trim() || 'Not provided'}\nInterested in: ${values.get('topic')}`;
      draftText.value = message;
      draftLink.href = `mailto:natelya@investyoungmoney.com?subject=${encodeURIComponent('Inquiry: ' + values.get('topic'))}&body=${encodeURIComponent(message)}`;
      result.hidden = false;
      return message;
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!prepareDraft()) return;
      status.textContent = 'Your draft is ready. Send it from your email app. If the app does not open, copy the message below and email natelya@investyoungmoney.com.';
      draftLink.click();
    });
  }
  const proposalForm = root.querySelector('#proposal-form');
  if (proposalForm) {
    proposalForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!proposalForm.reportValidity()) return;
      const values = new FormData(proposalForm);
      const body = [
        'Hello Invest Young Money,', '',
        `I would like to discuss corporate financial wellness training for ${values.get('organization').trim()}.`, '',
        `Name: ${values.get('name').trim()}`,
        `Work email: ${values.get('email').trim()}`,
        `Phone: ${values.get('phone').trim() || 'Not provided'}`,
        `Audience and group size: ${values.get('audience').trim()}`,
        `Preferred format: ${values.get('format')}`,
        `Goals, topics, and timing: ${values.get('message').trim()}`
      ].join('\n');
      root.querySelector('#proposal-status').textContent = 'Review and send the draft in your email app. If it does not open, email natelya@investyoungmoney.com directly.';
      window.location.href = `mailto:natelya@investyoungmoney.com?subject=${encodeURIComponent('Corporate training proposal inquiry')}&body=${encodeURIComponent(body)}`;
    });
  }
})();
