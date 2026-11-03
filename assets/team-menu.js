document.addEventListener('DOMContentLoaded', function () {
  var bars = document.querySelectorAll('.team-bar[data-section-id]');

  bars.forEach(function (bar) {
    var productsScriptId = bar.getAttribute('data-products-script-id');
    var searchDrawerId = bar.getAttribute('data-search-drawer-id');
    var mobileNavId = bar.getAttribute('data-mobile-nav-id');

    var drawer = searchDrawerId ? document.getElementById(searchDrawerId) : null;
    var mobileNav = mobileNavId ? document.getElementById(mobileNavId) : null;
    var jsonScript = productsScriptId ? document.getElementById(productsScriptId) : null;

    var toggle = bar.querySelector('.team-bar__toggle');
    var searchToggles = bar.querySelectorAll('.team-bar__search-toggle');
    var products = [];

    if (jsonScript) {
      try {
        products = JSON.parse(jsonScript.textContent);
      } catch (e) {
        products = [];
      }
    }

    function setMenuExpanded(value) {
      if (toggle) {
        toggle.setAttribute('aria-expanded', value ? 'true' : 'false');
      }
    }

    function resetMobileSubmenus() {
      bar.querySelectorAll('.team-bar__mobile-item.is-open').forEach(function (item) {
        item.classList.remove('is-open');
      });

      bar.querySelectorAll('.team-bar__mobile-item.has-children > .team-bar__mobile-link').forEach(function (link) {
        link.setAttribute('aria-expanded', 'false');
      });
    }

    function openMobileMenu() {
      bar.classList.add('is-open');
      setMenuExpanded(true);
    }

    function closeMobileMenu() {
      bar.classList.remove('is-open');
      setMenuExpanded(false);
      resetMobileSubmenus();
    }

    function toggleMobileMenu() {
      if (bar.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
      });
    }

    bar.querySelectorAll('.team-bar__mobile-item.has-children > .team-bar__mobile-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 767px)').matches) {
          e.preventDefault();
          var li = link.parentElement;
          var isOpen = li.classList.toggle('is-open');
          link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    });

    if (!drawer) return;

    var overlay = drawer.querySelector('.team-search-drawer__overlay');
    var closeBtn = drawer.querySelector('.team-search-drawer__close');
    var input = drawer.querySelector('.team-search-drawer__input');
    var resultsContainer = drawer.querySelector('.team-search-drawer__results');
    var emptyState = drawer.querySelector('.team-search-drawer__empty');

    function setSearchExpanded(value) {
      searchToggles.forEach(function (btn) {
        btn.setAttribute('aria-expanded', value ? 'true' : 'false');
      });
    }

    function openSearchDrawer() {
      closeMobileMenu();
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      setSearchExpanded(true);

      setTimeout(function () {
        if (input) input.focus();
      }, 60);
    }

    function closeSearchDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      setSearchExpanded(false);
    }

    function renderResults(items) {
      if (!resultsContainer) return;

      if (!items || items.length === 0) {
        resultsContainer.innerHTML = '';
        if (emptyState) emptyState.textContent = 'No results found.';
        return;
      }

      if (emptyState) emptyState.textContent = '';

      var html = '<ul class="team-search-drawer__list">';
      items.forEach(function (p) {
        html += '<li class="team-search-drawer__item">';
        html += '<div class="team-search-drawer__row">';
        html += '<a href="' + p.url + '" class="team-search-drawer__main">';

        if (p.image) {
          html += '<span class="team-search-drawer__image-wrap"><img src="' + p.image + '" alt="' + (p.title || '') + '"></span>';
        } else {
          html += '<span class="team-search-drawer__image-wrap"></span>';
        }

        html += '<span class="team-search-drawer__text">';
        html += '<span class="team-search-drawer__title">' + p.title + '</span>';
        if (p.price) html += '<span class="team-search-drawer__price">' + p.price + '</span>';
        html += '</span>';
        html += '</a>';

        if (p.variant_id) {
          var disabledAttr = p.available ? '' : ' disabled';
          var btnLabel = p.available ? 'Add' : 'Sold out';
          html += '<button type="button" class="team-search-drawer__add" data-variant-id="' + p.variant_id + '"' + disabledAttr + '>' + btnLabel + '</button>';
        }

        html += '</div>';
        html += '</li>';
      });
      html += '</ul>';

      resultsContainer.innerHTML = html;
    }

    searchToggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openSearchDrawer();
      });
    });

    if (overlay) {
      overlay.addEventListener('click', closeSearchDrawer);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSearchDrawer);
    }

    if (input) {
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();

        if (q.length < 2) {
          if (resultsContainer) resultsContainer.innerHTML = '';
          if (emptyState) emptyState.textContent = 'Start typing to search team products.';
          return;
        }

        var matches = products.filter(function (p) {
          var title = (p.title || '').toLowerCase();
          var vendor = (p.vendor || '').toLowerCase();
          return title.indexOf(q) !== -1 || vendor.indexOf(q) !== -1;
        }).slice(0, 12);

        renderResults(matches);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (drawer.classList.contains('is-open')) {
          closeSearchDrawer();
        }
        if (bar.classList.contains('is-open')) {
          closeMobileMenu();
        }
      }
    });

    document.addEventListener('click', function (event) {
      var addBtn = event.target.closest('.team-search-drawer__add');
      if (addBtn) {
        var variantId = addBtn.getAttribute('data-variant-id');
        if (!variantId) return;

        addBtn.disabled = true;
        var originalText = addBtn.textContent;
        addBtn.textContent = 'Adding…';

        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            id: Number(variantId),
            quantity: 1
          })
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Add failed');
            return fetch('/cart.js', {
              headers: { Accept: 'application/json' }
            });
          })
          .then(function (res) {
            return res.json();
          })
          .then(function (cart) {
            var bubbles = bar.querySelectorAll('.team-bar__cart-count');
            bubbles.forEach(function (bubble) {
              bubble.textContent = cart.item_count;
              bubble.style.display = cart.item_count > 0 ? 'inline-block' : 'none';
            });

            addBtn.textContent = 'Added';
            setTimeout(function () {
              addBtn.textContent = originalText;
              addBtn.disabled = false;
            }, 1200);
          })
          .catch(function () {
            addBtn.textContent = 'Error';
            setTimeout(function () {
              addBtn.textContent = originalText;
              addBtn.disabled = false;
            }, 1500);
          });

        return;
      }

      if (bar.classList.contains('is-open')) {
        var clickedInsideBar = bar.contains(event.target);
        var clickedInsideMobileNav = mobileNav ? mobileNav.contains(event.target) : false;

        if (!clickedInsideBar && !clickedInsideMobileNav) {
          closeMobileMenu();
        }
      }
    });
  });
});