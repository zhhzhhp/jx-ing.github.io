(function () {
  const body = document.body;
  const themeBtns = document.querySelectorAll('.theme-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  const modal = document.getElementById('galleryModal');
  const modalGallery = document.getElementById('modalGallery');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.querySelector('.nav');

  const projects = {
    'ui-b2b': {
      title: '禾中济线上教学B端管理系统',
      pages: range(5, 25),
      folder: 'ui'
    },
    'ui-web': {
      title: '太极数智官网视觉改版',
      pages: range(27, 37),
      folder: 'ui'
    },
    'ui-app': {
      title: '蜗梦 — 租房找房APP',
      pages: range(39, 61),
      folder: 'ui'
    },
    'ui-practice': {
      title: '个人临摹练习',
      pages: range(63, 69),
      folder: 'ui'
    },
    'brand-migratory': {
      title: '候鸟青年 — 品牌设计',
      pages: range(4, 17),
      folder: 'brand'
    },
    'brand-vi': {
      title: '湖北体育 — VI手册设计',
      pages: range(18, 38),
      folder: 'brand'
    },
    'brand-poster': {
      title: '创意招贴设计',
      pages: range(39, 48),
      folder: 'brand'
    },
    'brand-other': {
      title: '其他作品',
      pages: range(49, 55),
      folder: 'brand'
    }
  };

  function range(start, end) {
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }

  function pad(n) {
    return String(n).padStart(3, '0');
  }

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    filterBtns.forEach(btn => {
      const show = btn.dataset.portfolio === theme;
      btn.style.display = show ? '' : 'none';
      if (show && btn.dataset.filter === 'all') btn.classList.add('active');
      else if (!show) btn.classList.remove('active');
    });
    workCards.forEach(card => {
      const show = card.dataset.portfolio === theme;
      card.style.display = show ? '' : 'none';
    });
    updateHeroTags(theme);
    updateHeroSubtitle(theme);
  }

  function updateHeroSubtitle(theme) {
    const el = document.getElementById('heroSubtitle');
    if (el) {
      el.textContent = theme === 'brand' ? '品牌视觉作品集' : 'UI作品集';
    }
  }

  function updateHeroTags(theme) {
    document.querySelectorAll('.hero-project-tag').forEach(tag => {
      tag.style.display = tag.dataset.portfolio === theme ? '' : 'none';
    });
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.style.display === 'none') return;
      filterBtns.forEach(b => {
        if (b.dataset.portfolio === btn.dataset.portfolio) b.classList.remove('active');
      });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const portfolio = btn.dataset.portfolio;
      workCards.forEach(card => {
        if (card.dataset.portfolio !== portfolio) return;
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  function openGallery(projectId) {
    const project = projects[projectId];
    if (!project) return;
    modalTitle.textContent = project.title;
    modalGallery.innerHTML = project.pages.map(p => {
      const src = `assets/${project.folder}/page_${pad(p)}.jpg`;
      return `<img src="${src}" alt="${project.title} - ${p}" loading="lazy">`;
    }).join('');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  workCards.forEach(card => {
    card.addEventListener('click', () => openGallery(card.dataset.project));
  });

  document.querySelectorAll('.hero-project-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const projectId = tag.dataset.project;
      if (projectId) {
        document.getElementById('works').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => openGallery(projectId), 400);
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalGallery.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
      lightboxImg.src = e.target.src;
      lightbox.classList.add('open');
    }
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      lightbox.classList.remove('open');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));

  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObs.observe(el));

  /* ── Nav auto-hide ── */
  let lastScrollY = window.scrollY;
  let hideTimer = null;
  const TOP_THRESHOLD = 8;

  function isAtTop() {
    return window.scrollY <= TOP_THRESHOLD;
  }

  function showNav() {
    if (!nav) return;
    nav.classList.remove('nav-hidden');
  }

  function hideNav() {
    if (!nav || isAtTop()) return;
    nav.classList.add('nav-hidden');
  }

  function resetHideTimer() {
    clearTimeout(hideTimer);
    if (isAtTop()) {
      showNav();
      return;
    }
    hideTimer = setTimeout(hideNav, 1000);
  }

  function onScroll() {
    const currentY = window.scrollY;

    if (isAtTop()) {
      showNav();
      clearTimeout(hideTimer);
    } else if (currentY > lastScrollY) {
      hideNav();
      clearTimeout(hideTimer);
    } else if (currentY < lastScrollY) {
      showNav();
      resetHideTimer();
    }

    lastScrollY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  setTheme('ui');
})();
